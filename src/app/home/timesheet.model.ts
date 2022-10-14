export interface Timesheet {
    date?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    isLeave?: boolean;
    status?: 'approved' | 'sent' | 'rejected';
    uid?: string;
    employeeUID?: string;
    employeeName?: string;
    docUrl?: string;
}