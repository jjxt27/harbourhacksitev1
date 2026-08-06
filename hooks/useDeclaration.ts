"use client";

import { useCallback, useReducer } from "react";
import {
  MAX_CARGO,
  customs,
  declarationFields,
  type ContainerId,
  type FieldName,
} from "@/content/customs";

/**
 * The customs declaration, as one state machine.
 *
 * Everything about clearing customs is here: what has been declared, what is on
 * the barge, what is wrong with it, and how far through the crane sequence we
 * are. The form, the barge, the crane button and the boarding pass all read
 * this and nothing else, so there is exactly one answer to "can this be
 * submitted" and one place it can change.
 *
 * The phases are a straight line with two exits:
 *
 *   editing ──▶ clearing ──▶ printing ──▶ done
 *                  │             └──────▶ jammed   (see below)
 *                  └──────────────────▶ rejected  (submission failed)
 *
 * `jammed` matters more than it looks, and it covers two different failures
 * that the UI has to tell apart by whether `passUrl` survived:
 *
 *   with a url — the pass rendered, the automatic save did not go through.
 *   Browsers are entitled to refuse a programmatic download this far from the
 *   click that started it, so that path has to fail into a visible button.
 *
 *   without one — the rasteriser itself did not finish. That is recoverable by
 *   asking again, most often because the tab was hidden at the time and
 *   html-to-image resolves inside a `requestAnimationFrame` that never fired.
 */

export type Phase = "editing" | "clearing" | "printing" | "done" | "jammed" | "rejected";

export type Declaration = {
  fields: Record<FieldName, string>;
  cargo: readonly ContainerId[];
  errors: Partial<Record<FieldName | "cargo", string>>;
  phase: Phase;
  manifestNo: string | null;
  /** The rendered pass, kept so "download again" never re-rasterises. */
  passUrl: string | null;
  /**
   * Errors stay hidden until the first submit. Telling someone their email is
   * invalid while they are still typing the local part is just noise.
   */
  submitted: boolean;
};

const EMPTY_FIELDS = Object.fromEntries(
  declarationFields.map((field) => [field.name, ""]),
) as Record<FieldName, string>;

export const START: Declaration = {
  fields: EMPTY_FIELDS,
  cargo: [],
  errors: {},
  phase: "editing",
  manifestNo: null,
  passUrl: null,
  submitted: false,
};

/**
 * Deliberately permissive. A stricter pattern rejects real addresses — plus
 * signs, new TLDs, unicode local parts — and the only thing that actually
 * proves an address works is sending to it.
 */
const LOOKS_LIKE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOOKS_LIKE_URL = /^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/;

/** Pure, and shared by the crane's active state and the submit path. */
export function validate(
  fields: Record<FieldName, string>,
  cargo: readonly ContainerId[],
): Declaration["errors"] {
  const errors: Declaration["errors"] = {};

  for (const field of declarationFields) {
    const value = fields[field.name].trim();
    if (field.required && !value) {
      errors[field.name] = customs.errors[field.name];
    }
  }

  const email = fields.email.trim();
  if (email && !LOOKS_LIKE_EMAIL.test(email)) errors.email = customs.errors.email;

  const linkedin = fields.linkedin.trim();
  if (linkedin && !LOOKS_LIKE_URL.test(linkedin)) errors.linkedin = customs.errors.linkedin;

  if (cargo.length === 0) errors.cargo = customs.errors.cargo;

  return errors;
}

export const isClear = (state: Declaration) =>
  Object.keys(validate(state.fields, state.cargo)).length === 0;

type Action =
  | { type: "field"; name: FieldName; value: string }
  | { type: "load"; id: ContainerId }
  | { type: "unload"; id: ContainerId }
  | { type: "submit" }
  | { type: "clearedCustoms"; manifestNo: string }
  | { type: "printed"; url: string }
  | { type: "jammed"; url: string | null }
  | { type: "retryPrint" }
  | { type: "rejected" }
  | { type: "amend" }
  | { type: "reset" };

function reducer(state: Declaration, action: Action): Declaration {
  switch (action.type) {
    case "field": {
      const fields = { ...state.fields, [action.name]: action.value };
      return {
        ...state,
        fields,
        // Once someone has been shown errors, clear each one the moment it is
        // fixed rather than making them submit again to find out.
        errors: state.submitted ? validate(fields, state.cargo) : state.errors,
      };
    }

    case "load": {
      if (state.cargo.includes(action.id) || state.cargo.length >= MAX_CARGO) return state;
      const cargo = [...state.cargo, action.id];
      return {
        ...state,
        cargo,
        errors: state.submitted ? validate(state.fields, cargo) : state.errors,
      };
    }

    case "unload": {
      const cargo = state.cargo.filter((id) => id !== action.id);
      if (cargo.length === state.cargo.length) return state;
      return {
        ...state,
        cargo,
        errors: state.submitted ? validate(state.fields, cargo) : state.errors,
      };
    }

    case "submit": {
      const errors = validate(state.fields, state.cargo);
      if (Object.keys(errors).length > 0) {
        return { ...state, errors, submitted: true, phase: "editing" };
      }
      return { ...state, errors: {}, submitted: true, phase: "clearing" };
    }

    case "clearedCustoms":
      return { ...state, phase: "printing", manifestNo: action.manifestNo };

    case "printed":
      return { ...state, phase: "done", passUrl: action.url };

    case "jammed":
      return { ...state, phase: "jammed", passUrl: action.url };

    case "retryPrint":
      // Only from a jam with nothing to show for it. If the pass rendered, the
      // download button is the way out, not another render.
      if (state.phase !== "jammed" || state.passUrl) return state;
      return { ...state, phase: "printing" };

    case "rejected":
      return { ...state, phase: "rejected" };

    case "amend":
      // Keep what they typed. Drop the pass — the details behind it changed.
      return { ...state, phase: "editing", manifestNo: null, passUrl: null };

    case "reset":
      return START;

    default:
      return state;
  }
}

export function useDeclaration() {
  const [state, dispatch] = useReducer(reducer, START);

  const setField = useCallback(
    (name: FieldName, value: string) => dispatch({ type: "field", name, value }),
    [],
  );
  const load = useCallback((id: ContainerId) => dispatch({ type: "load", id }), []);
  const unload = useCallback((id: ContainerId) => dispatch({ type: "unload", id }), []);
  const toggle = useCallback(
    (id: ContainerId, loaded: boolean) =>
      dispatch(loaded ? { type: "unload", id } : { type: "load", id }),
    [],
  );

  return { state, dispatch, setField, load, unload, toggle };
}
