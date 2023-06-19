export const ResponseTypeDefault: ResponseType = {
  success: false,
  message: null,
  data: null,
};

export interface ResponseType {
  success: boolean;
  message: string | null;
  data: any;
}
