export interface StudentScoreResponse
{
	studentId: string;
	khFirstName: string;
	khLastName: string;
	enFirstName: string;
	enLastName: string;
	gender: string;
	studentCode: string;

	className: string;
	subjectName: string;
	semesterName: string;

	Score: number;
	status: boolean;

	creationAt: string;
	updatedAt: string;
}