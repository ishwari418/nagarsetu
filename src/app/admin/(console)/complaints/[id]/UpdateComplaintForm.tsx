"use client";

import { useFormState } from "react-dom";
import { updateComplaint } from "@/lib/actions/complaints";
import { Alert, Card, CardHead, Field, Select, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { PRIORITIES, STATUSES, PRIORITY_LABEL, STATUS_LABEL } from "@/lib/constants";

export function UpdateComplaintForm({
  id,
  priority,
  status,
}: {
  id: string;
  priority: string;
  status: string;
}) {
  const [state, action] = useFormState(updateComplaint, {});

  return (
    <Card>
      <CardHead title="Update this complaint" hint="The citizen sees the change immediately." />
      <form action={action} className="space-y-4 px-5 py-5">
        <input type="hidden" name="id" value={id} />
        {state.error && <Alert>{state.error}</Alert>}
        {state.ok && <Alert tone="success">Complaint updated.</Alert>}

        <Field label="Priority" htmlFor="priority">
          <Select id="priority" name="priority" defaultValue={priority}>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABEL[p]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Status" htmlFor="status">
          <Select id="status" name="status" defaultValue={status}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Note for the record" htmlFor="note" hint="Shown to the citizen on the timeline.">
          <Textarea id="note" name="note" rows={2} placeholder="Repair crew scheduled for Thursday." />
        </Field>

        <SubmitButton pendingText="Saving…">Save changes</SubmitButton>
      </form>
    </Card>
  );
}
