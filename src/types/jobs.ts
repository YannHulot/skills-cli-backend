export interface JobInput {
  companyName: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  stack?: string[];
}
