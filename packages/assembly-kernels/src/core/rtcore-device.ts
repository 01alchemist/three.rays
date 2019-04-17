export class RTCError {
  static RTC_ERROR_NONE = 0
  static RTC_ERROR_UNKNOWN = 1
  static RTC_ERROR_INVALID_ARGUMENT = 2
  static RTC_ERROR_INVALID_OPERATION = 3
  static RTC_ERROR_OUT_OF_MEMORY = 4
  static RTC_ERROR_UNSUPPORTED_CPU = 5
  static RTC_ERROR_CANCELLED = 6

  constructor(code: int, message: string) {}
}
