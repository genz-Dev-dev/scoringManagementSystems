export interface AuditLog<T = any>
{
	id: string;
	action: 'INSERT' | 'UPDATE' | 'DELETE';
	changeAt: string;
	recordId: string | null;
	tableName: string;
	oldData: T | null;
	newData: T | null;

}