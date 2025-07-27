"use client";

import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import clsx from "clsx";
import {
  type FieldArrayWithId,
  useFieldArray,
  useForm,
  type UseFormRegister,
  type UseFormWatch,
} from "react-hook-form";
import Markdown from "react-markdown";
import { BiGlobe, BiPlus } from "react-icons/bi";

interface FormValues {
  evidences: {
    type: "website" | "upload";
    url?: string;
    comment: string;
  }[];
  instructions: string;
}

export default function NewCasePage() {
  const { control, watch, register, handleSubmit } = useForm<FormValues>();

  const evidencesField = useFieldArray({ control, name: "evidences" });

  const { messages, append } = useChat({
    api: "/api/cases/chat",
    body: { evidences: watch("evidences") },
  });

  console.log("messages", messages);

  return (
    <div className="p-4">
      <h1>New Case</h1>

      <form
        onSubmit={(e) => {
          handleSubmit(async (data) => {
            await append({ role: "user", content: data.instructions });
          })(e);
        }}
      >
        <div className="flex flex-col gap-2">
          {evidencesField.fields.map((field, index) => (
            <EvidenceFormPart
              key={field.id}
              field={field}
              watch={watch}
              register={register}
              fieldIndex={index}
            />
          ))}
        </div>

        <div className="flex flex-row p-2">
          <button
            type="button"
            onClick={() => {
              evidencesField.append({
                type: "website",
                comment: "",
              });
            }}
            className="btn btn-sm"
          >
            <BiPlus size="1.2em" />
            New Evidence
          </button>
        </div>

        {messages.length === 0 ? (
          <>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Instructions</legend>
              <textarea className="textarea" {...register("instructions")} />
              <p>
                Share any additional instructions around how to handle the
                evidences
              </p>
            </fieldset>

            <div className="flex flex-row justify-end">
              <button type="submit" className="btn btn-primary">
                Start a new case
              </button>
            </div>
          </>
        ) : null}
      </form>

      {messages.length ? (
        <ChatSection
          messages={messages}
          onNewMessage={(msg) => {
            append({ role: "user", content: msg });
          }}
        />
      ) : null}
    </div>
  );
}

function ChatSection({
  messages,
  onNewMessage,
}: {
  messages: UIMessage[];
  onNewMessage: (input: string) => void;
}) {
  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      {messages.map((msg) => {
        switch (msg.role) {
          case "assistant":
            return (
              <div key={msg.id} className="bg-base-200 rounded-box p-4">
                <div className="prose">
                  <Markdown>{msg.content}</Markdown>
                </div>
              </div>
            );

          case "user":
            return (
              <div
                key={msg.id}
                className="bg-base-300 rounded-box p-4 font-bold text-right"
              >
                {msg.content}
              </div>
            );

          default:
            // do nothing
            return null;
        }
      })}

      <MessageBox onNewMessage={onNewMessage} />
    </div>
  );
}

function MessageBox({
  onNewMessage,
}: {
  onNewMessage: (input: string) => void;
}) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { message: "" },
  });
  return (
    <form
      action=""
      onSubmit={(ev) => {
        handleSubmit((data) => {
          onNewMessage(data.message);
          reset();
        })(ev);
      }}
    >
      <fieldset className="fieldset">
        <textarea
          className="textarea w-full"
          placeholder="Ask RAID"
          {...register("message")}
        />
        <p>Any further questions?</p>
      </fieldset>

      <div className="flex flex-row justify-end">
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </div>
    </form>
  );
}

function EvidenceFormPart({
  watch,
  register,
  className,
  fieldIndex,
}: {
  watch: UseFormWatch<FormValues>;
  className?: string;
  fieldIndex: number;
  register: UseFormRegister<FormValues>;
  field: FieldArrayWithId<FormValues, "evidences", "id">;
}) {
  const field = watch(`evidences.${fieldIndex}`);

  return (
    <div className={clsx("border border-base-300 rounded-box p-4", className)}>
      <select className="select" {...register(`evidences.${fieldIndex}.type`)}>
        <option value="upload">Upload</option>
        <option value="website">Website</option>
      </select>

      {field.type === "website" ? (
        <fieldset className="fieldset">
          <legend className="fieldset-legend">Website</legend>
          <label className="input">
            <BiGlobe />
            <input
              type="text"
              className="grow"
              {...register(`evidences.${fieldIndex}.url`)}
            />
          </label>
          <p className="label">Provide a link to the website</p>
        </fieldset>
      ) : null}

      <fieldset className="fieldset">
        <input
          type="text"
          className="input"
          placeholder="Share any additional info around this evidence"
          {...register(`evidences.${fieldIndex}.comment`)}
        />
        <p>Optional</p>
      </fieldset>
    </div>
  );
}
