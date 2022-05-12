export interface BugfenderPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
}
