// frontend/src/pages/CourseManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const GradeDialog = ({ student, courseId, onGradeSubmitted }) => {
    const [grade, setGrade] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = async () => {
        try {
            await api.post('/api/faculty/grades', {
                studentId: student.id,
                courseId,
                grade,
                comments
            });
            onGradeSubmitted(); // This could trigger a refresh
        } catch (err) {
            alert('Failed to submit grade.');
        }
    };

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Grade for {student.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="grade" className="text-right">Grade (A-F)</Label>
                    <Input id="grade" value={grade} onChange={e => setGrade(e.target.value)} className="col-span-3" maxLength="2" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="comments" className="text-right">Comments</Label>
                    <Input id="comments" value={comments} onChange={e => setComments(e.target.value)} className="col-span-3" />
                </div>
            </div>
            <Button onClick={handleSubmit}>Submit Grade</Button>
        </DialogContent>
    );
};

const CourseManagementPage = () => {
    const { courseId } = useParams();
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        api.get(`/api/faculty/courses/${courseId}/students`)
            .then(res => setStudents(res.data))
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, [courseId]);

    if (isLoading) return <LoadingSpinner />;

    return (
        <Card>
            <CardHeader><CardTitle>Enrolled Students</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {students.map(student => (
                        <Dialog key={student.id}>
                            <div className="flex justify-between items-center p-2 border rounded">
                                <p>{student.name} ({student.email})</p>
                                <DialogTrigger asChild><Button>Assign Grade</Button></DialogTrigger>
                            </div>
                            <GradeDialog student={student} courseId={courseId} onGradeSubmitted={() => {}} />
                        </Dialog>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
export default CourseManagementPage;