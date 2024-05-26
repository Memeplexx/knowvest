"use client";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { Props } from "./constants";
import { useInputs } from "./inputs";

export const TextAreaDebounced = (
  props: Props & TextareaHTMLAttributes<unknown>
) => <textarea {...useInputs(props)} />;

export const InputDebounced = (
  props: Props & InputHTMLAttributes<unknown>
) => <input {...useInputs(props)} />;

