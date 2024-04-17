"use client";
import { useInputs } from "./inputs";
import { Props } from "./constants";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

export const TextAreaDebounced = (
  props: Props & TextareaHTMLAttributes<unknown>
) => <textarea {...useInputs(props)} />;

export const InputDebounced = (
  props: Props & InputHTMLAttributes<unknown>
) => <input {...useInputs(props)} />;

