import { z } from "zod";

export type RecoveryConfig = {
  address?: `0x${string}`;
  onUserOperation: (userOpCallData: UserOperationCallData) => Promise<void>;
}

export type RecoveryPopupMessage = {
  type: 'tx-submitted';
  status: 'processing' | 'done';
}

const UserOperationCallDataSchema = z.object({
  /* the target of the call */
  target: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  /* the data passed to the target */
  data: z.string().regex(/^0x[a-fA-F0-9]+$/),
  /* the amount of native token to send to the target (default: 0) */
  value: z.bigint().optional(),
});

type UserOperationCallData = z.infer<typeof UserOperationCallDataSchema>;

// Usage example
export const validateUserOperationCallData = (data: any) => {
  return UserOperationCallDataSchema.safeParse(data);
};