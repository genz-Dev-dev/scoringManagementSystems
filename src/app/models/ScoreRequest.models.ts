export interface ScoreRequest
{
	semesterId: String;
	subjectId: String;
	studentId: String;
	userId: String;
	score: number;
	version: number;
	status: boolean;
}