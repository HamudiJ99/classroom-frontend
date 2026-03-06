import { AdvancedImage } from "@cloudinary/react";
import { useShow, useDelete, useCreate, useNotification } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import {
    ShowView,
    ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails, User } from "@/types";
import { Plus, UserMinus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useList } from "@refinedev/core";

type ClassUser = {
    id: string;
    name: string;
    email: string;
    role: string;
    image?: string | null;
};

const ClassesShow = () => {
    const { id } = useParams();
    const classId = id ?? "";
    const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const { query } = useShow<ClassDetails>({
        resource: "classes",
    });

    const { mutate: enrollStudent, isLoading: isEnrolling } = useCreate() as any;
    const { mutate: unenrollStudent } = useDelete();
    const { open } = useNotification();

    const classDetails = query.data?.data;

    // Fetch students for enrollment dialog
    const { data: studentsData } = useList<User>({
        resource: "users",
        filters: [
            {
                field: "role",
                operator: "eq",
                value: "student",
            },
        ],
    }) as any;

    const handleEnroll = () => {
        if (!selectedStudentId) return;

        enrollStudent(
            {
                resource: "enrollments",
                values: {
                    studentId: selectedStudentId,
                    classId: Number(classId),
                },
            },
            {
                onSuccess: () => {
                    open?.({
                        type: "success",
                        message: "Student enrolled successfully",
                    });
                    setIsEnrollDialogOpen(false);
                    studentsTable.refineCore.onSearch?.([]); // Refresh table
                },
            }
        );
    };

    const handleUnenroll = (studentId: string) => {
        unenrollStudent(
            {
                resource: `enrollments`,
                id: `unenroll?studentId=${studentId}&classId=${classId}`,
            },
            {
                onSuccess: () => {
                    open?.({
                        type: "success",
                        message: "Student unenrolled successfully",
                    });
                    studentsTable.refineCore.onSearch?.([]); // Refresh table
                },
            }
        );
    };

    const studentColumns = useMemo<ColumnDef<ClassUser>[]>(
        () => [
            {
                id: "name",
                accessorKey: "name",
                size: 240,
                header: () => <p className="column-title">Student</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-7">
                            {row.original.image && (
                                <AvatarImage src={row.original.image} alt={row.original.name} />
                            )}
                            <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="truncate">{row.original.name}</span>
                            <span className="text-xs text-muted-foreground truncate">
                                {row.original.email}
                            </span>
                        </div>
                    </div>
                ),
            },
            {
                id: "actions",
                size: 140,
                header: () => <p className="column-title">Actions</p>,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <ShowButton
                            resource="users"
                            recordItemId={row.original.id}
                            variant="outline"
                            size="sm"
                        >
                            View
                        </ShowButton>
                        <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleUnenroll(row.original.id)}
                        >
                            <UserMinus className="h-4 w-4 mr-1" />
                            Unenroll
                        </Button>
                    </div>
                ),
            },
        ],
        [classId]
    );

    const studentsTable = useTable<ClassUser>({
        columns: studentColumns,
        refineCoreProps: {
            resource: `classes/${classId}/users`,
            pagination: {
                pageSize: 3,
                mode: "server",
            },
            filters: {
                permanent: [
                    {
                        field: "role",
                        operator: "eq",
                        value: "student",
                    },
                ],
            },
        },
    }) as any;

    if (query.isLoading || query.isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details" />
                <p className="state-message">
                    {query.isLoading
                        ? "Loading class details..."
                        : query.isError
                            ? "Failed to load class details."
                            : "Class details not found."}
                </p>
            </ShowView>
        );
    }

    const teacherName = classDetails.teacher?.name ?? "Unknown";
    const teacherInitials = teacherName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

    const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
        teacherInitials || "NA"
    )}`;

    return (
        <ShowView className="class-view class-show space-y-6">
            <ShowViewHeader resource="classes" title="Class Details" />

            <div className="banner">
                {classDetails.bannerUrl ? (
                    classDetails.bannerUrl.includes("res.cloudinary.com") &&
                    classDetails.bannerCldPubId ? (
                        <AdvancedImage
                            cldImg={bannerPhoto(
                                classDetails.bannerCldPubId ?? "",
                                classDetails.name
                            )}
                            alt="Class Banner"
                        />
                    ) : (
                        <img
                            src={classDetails.bannerUrl}
                            alt={classDetails.name}
                            loading="lazy"
                        />
                    )
                ) : (
                    <div className="placeholder" />
                )}
            </div>

            <Card className="details-card">
                {/* Class Details */}
                <div>
                    <div className="details-header">
                        <div>
                            <h1>{classDetails.name}</h1>
                            <p>{classDetails.description}</p>
                        </div>

                        <div>
                            <Badge variant="outline">{classDetails.capacity} spots</Badge>
                            <Badge
                                variant={
                                    classDetails.status === "active" ? "default" : "secondary"
                                }
                                data-status={classDetails.status}
                            >
                                {classDetails.status.toUpperCase()}
                            </Badge>
                        </div>
                    </div>

                    <div className="details-grid">
                        <div className="instructor">
                            <p>👨‍🏫 Instructor</p>
                            <div>
                                <img
                                    src={classDetails.teacher?.image ?? placeholderUrl}
                                    alt={teacherName}
                                />

                                <div>
                                    <p>{teacherName}</p>
                                    <p>{classDetails?.teacher?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="department">
                            <p>🏛️ Department</p>

                            <div>
                                <p>{classDetails?.department?.name}</p>
                                <p>{classDetails?.department?.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Subject Card */}
                <div className="subject">
                    <p>📚 Subject</p>

                    <div>
                        <Badge variant="outline">
                            Code: <span>{classDetails?.subject?.code}</span>
                        </Badge>
                        <p>{classDetails?.subject?.name}</p>
                        <p>{classDetails?.subject?.description}</p>
                    </div>
                </div>

                <Separator />

                {/* Join Class Section */}
                <div className="join">
                    <h2>🎓 Join Class</h2>

                    <ol>
                        <li>Ask your teacher for the invite code.</li>
                        <li>Click on &quot;Join Class&quot; button.</li>
                        <li>Paste the code and click &quot;Join&quot;</li>
                    </ol>
                </div>

                <Button size="lg" className="w-full">
                    Join Class
                </Button>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Enrolled Students</CardTitle>
                    <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Enroll Student
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Enroll Student</DialogTitle>
                                <DialogDescription>
                                    Select a student to enroll in this class.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Select onValueChange={setSelectedStudentId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a student" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {studentsData?.data?.map((student: User) => (
                                            <SelectItem key={student.id} value={student.id}>
                                                {student.name} ({student.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleEnroll} disabled={!selectedStudentId || isEnrolling}>
                                {isEnrolling ? "Enrolling..." : "Enroll Student"}
                            </Button>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <DataTable table={studentsTable} />
                </CardContent>
            </Card>
        </ShowView>
    );
};

const getInitials = (name = "") => {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
    return `${parts[0][0] ?? ""}${
        parts[parts.length - 1][0] ?? ""
    }`.toUpperCase();
};

export default ClassesShow;