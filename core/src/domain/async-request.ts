export enum AsyncRequestStatus {
  NotStarted = "NOT_STARTED",
  Started = "STARTED",
  Success = "SUCCESS",
  Failure = "FAILURE",
}

export type NotStartedAsyncRequest = {
  status: AsyncRequestStatus.NotStarted;
};

export type StartedAsyncRequest<T> = {
  status: AsyncRequestStatus.Started;
  data: T;
};

export type SuccessfulAsyncRequest<T> = {
  status: AsyncRequestStatus.Success;
  data: T;
};

export type FailedAsyncRequest = {
  status: AsyncRequestStatus.Failure;
  error: string;
};

export type AsyncRequest<TBody, TResult> =
  | NotStartedAsyncRequest
  | StartedAsyncRequest<TBody>
  | SuccessfulAsyncRequest<TResult>
  | FailedAsyncRequest;

export const asyncRequest = {
  notStarted(): NotStartedAsyncRequest {
    return { status: AsyncRequestStatus.NotStarted };
  },
  started<T>(data: T): StartedAsyncRequest<T> {
    return {
      status: AsyncRequestStatus.Started,
      data,
    };
  },
  success<T>(data: T): SuccessfulAsyncRequest<T> {
    return {
      status: AsyncRequestStatus.Success,
      data,
    };
  },
  failure(error: string): FailedAsyncRequest {
    return {
      status: AsyncRequestStatus.Failure,
      error,
    };
  },
};
