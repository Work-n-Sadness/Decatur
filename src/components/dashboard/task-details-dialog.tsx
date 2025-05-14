
"use client";

import type { Task, ActivityLog, ResolutionStatus, TaskCategory, Role, TaskFrequency } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { getTaskCategoryIcon, getResolutionStatusIcon } from '@/components/icons';
import { CalendarIcon, User, Users, Briefcase, Edit3, Save, X, ListChecks, Percent, Clock, Repeat, CheckSquare, Paperclip, ExternalLink, LinkIcon, BookOpen, UserCheck, Milestone } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import React, { useEffect, useState } from 'react';
import { allResolutionStatuses, allMockRoles } from '@/lib/mock-data'; // Import new statuses and roles

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  notes: z.string().optional(),
  assignedStaff: z.string().min(1, "Assigned staff is required"),
  status: z.enum(['Pending', 'Resolved', 'Escalated']), // Updated to ResolutionStatus
  progress: z.number().min(0).max(100),
  startDate: z.date(),
  endDate: z.date().nullable(),
  deliverables: z.string().optional(),
  responsibleRole: z.union([z.string(), z.array(z.string())]).refine(value => { // Allow string or array of strings
    if (Array.isArray(value)) return value.every(item => typeof item === 'string' && item.length > 0);
    return typeof value === 'string' && value.length > 0;
  }, "Responsible role is required"),
  validator: z.string().nullable().optional(),
  evidenceLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  complianceChapterTag: z.string().optional(),
  validatorApproval: z.string().optional(),
  lastCompletedOn: z.date().nullable().optional(),
  completedBy: z.string().nullable().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDetailsDialogProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
  onOpenAttachEvidence: (task: Task) => void;
}

export default function TaskDetailsDialog({ task, isOpen, onClose, onSave, onOpenAttachEvidence }: TaskDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (task) {
      form.reset({
        name: task.name,
        notes: task.notes || '',
        assignedStaff: task.assignedStaff,
        status: task.status,
        progress: task.progress,
        startDate: task.startDate && isValid(new Date(task.startDate)) ? (typeof task.startDate === 'string' ? parseISO(task.startDate) : new Date(task.startDate)) : new Date(),
        endDate: task.endDate && isValid(new Date(task.endDate)) ? (typeof task.endDate === 'string' ? parseISO(task.endDate) : new Date(task.endDate)) : null,
        deliverables: task.deliverables || '',
        responsibleRole: task.responsibleRole,
        validator: task.validator || null,
        evidenceLink: task.evidenceLink || '',
        complianceChapterTag: task.complianceChapterTag || '',
        validatorApproval: task.validatorApproval || '',
        lastCompletedOn: task.lastCompletedOn && isValid(new Date(task.lastCompletedOn)) ? new Date(task.lastCompletedOn) : null,
        completedBy: task.completedBy || null,
      });
    }
    if (!isOpen) {
      setIsEditing(false); // Reset editing state when dialog closes
    }
  }, [task, form, isOpen]);

  if (!task) return null;

  const CategoryIcon = getTaskCategoryIcon(task.category);
  const StatusIconWithClass = getResolutionStatusIcon(task.status);

  const handleSubmit = (data: TaskFormData) => {
    const updatedTask: Task = {
      ...task,
      ...data,
      startDate: data.startDate, // Ensure dates are correctly formatted if needed
      endDate: data.endDate,
      responsibleRole: data.responsibleRole as Role | Role[], // Cast to Role or Role[]
      validator: data.validator || null,
      evidenceLink: data.evidenceLink || undefined,
      complianceChapterTag: data.complianceChapterTag || undefined,
      validatorApproval: data.validatorApproval || undefined,
      lastCompletedOn: data.lastCompletedOn || null,
      completedBy: data.completedBy || null,
      activities: task.activities || [], // Preserve existing activities
    };

    if (data.status === 'Resolved' && task.status !== 'Resolved') {
      updatedTask.lastCompletedOn = new Date();
      updatedTask.completedBy = data.assignedStaff;
      updatedTask.progress = 100;
       updatedTask.activities.push({ timestamp: new Date(), user: data.assignedStaff, action: 'Task Resolved', details: 'Task marked as resolved.' });
    } else if (data.status !== 'Resolved' && task.status === 'Resolved') {
      // If moved from resolved to something else, clear resolution fields
      updatedTask.lastCompletedOn = null;
      updatedTask.completedBy = null;
       updatedTask.activities.push({ timestamp: new Date(), user: data.assignedStaff, action: 'Task Un-Resolved', details: 'Task status changed from resolved.' });
    }
    
    if (data.status === 'Resolved' && data.progress !== 100) {
        updatedTask.progress = 100;
        form.setValue('progress', 100); 
    }

    onSave(updatedTask); 
    setIsEditing(false);
  };

  const DetailItem: React.FC<{icon: React.ElementType, label: string, value: React.ReactNode, action?: React.ReactNode}> = ({ icon: Icon, label, value, action }) => (
    <div className="flex items-start space-x-3">
      <Icon className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
      <div className="flex-grow">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className="text-sm text-foreground flex items-center gap-2">
          {value || <span className="italic text-muted-foreground">N/A</span>}
          {action}
        </div>
      </div>
    </div>
  );
  
  const displayResponsibleRole = (role: Role | Role[] | undefined) => {
    if (!role) return 'N/A';
    if (Array.isArray(role)) return role.join(', ');
    return role;
  }


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center space-x-3">
            <CategoryIcon className="h-7 w-7 text-accent" />
            <DialogTitle className="text-2xl">{isEditing ? 'Edit Task' : task.name}</DialogTitle>
          </div>
          <DialogDescription className="flex items-center gap-2 pt-1">
            {StatusIconWithClass} {task.status}
            <span className="mx-1 text-muted-foreground">&bull;</span>
            Category: {task.category}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow">
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-6">
            {isEditing ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Task Name</Label>
                    <Input id="name" {...form.register("name")} className="mt-1" />
                    {form.formState.errors.name && <p className="text-sm text-destructive mt-1">{form.formState.errors.name.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor="responsibleRole">Responsible Role</Label>
                     <Controller
                        name="responsibleRole"
                        control={form.control}
                        render={({ field }) => (
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={Array.isArray(field.value) ? field.value[0] : field.value} // Handle single/array
                          >
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select responsible role" />
                            </SelectTrigger>
                            <SelectContent>
                                {allMockRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        )}
                    />
                    {form.formState.errors.responsibleRole && <p className="text-sm text-destructive mt-1">{form.formState.errors.responsibleRole.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="assignedStaff">Assigned Staff</Label>
                    <Input id="assignedStaff" {...form.register("assignedStaff")} className="mt-1" />
                     {form.formState.errors.assignedStaff && <p className="text-sm text-destructive mt-1">{form.formState.errors.assignedStaff.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor="validator">Validator Role/Name</Label>
                    <Controller
                        name="validator"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select validator (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {allMockRoles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                {/* Add option for specific staff names if needed */}
                            </SelectContent>
                          </Select>
                        )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Controller
                      name="status"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {allResolutionStatuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                   <div>
                    <Label htmlFor="progress">Progress (%)</Label>
                    <Controller
                        name="progress"
                        control={form.control}
                        render={({ field }) => (
                           <Input id="progress" type="number" {...field} 
                           onChange={e => field.onChange(parseInt(e.target.value))} 
                           className="mt-1" 
                           readOnly={form.getValues("status") === "Resolved"}
                           />
                        )}
                    />
                    {form.formState.errors.progress && <p className="text-sm text-destructive mt-1">{form.formState.errors.progress.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                     <Controller
                        name="startDate"
                        control={form.control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant={"outline"} className="w-full justify-start text-left font-normal mt-1">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value && isValid(new Date(field.value)) ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value && isValid(new Date(field.value)) ? new Date(field.value) : undefined} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date (Due Date)</Label>
                     <Controller
                        name="endDate"
                        control={form.control}
                        render={({ field }) => (
                            <Popover>
                                <PopoverTrigger asChild>
                                <Button variant={"outline"} className="w-full justify-start text-left font-normal mt-1">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value && isValid(new Date(field.value)) ? format(new Date(field.value), "PPP") : <span>Pick a date (optional)</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={field.value && isValid(new Date(field.value)) ? new Date(field.value) : undefined} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                  </div>
                  <div>
                    <Label htmlFor="complianceChapterTag">Compliance Chapter Tag</Label>
                    <Input id="complianceChapterTag" {...form.register("complianceChapterTag")} className="mt-1" placeholder="e.g., Ch. 14.31" />
                  </div>
                  <div>
                    <Label htmlFor="validatorApproval">Validator Approval Notes</Label>
                    <Input id="validatorApproval" {...form.register("validatorApproval")} className="mt-1" placeholder="e.g., Approved by Jane D. on..." />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="evidenceLink">Evidence Link (URL)</Label>
                    <Input id="evidenceLink" {...form.register("evidenceLink")} className="mt-1" placeholder="https://example.com/evidence.pdf"/>
                    {form.formState.errors.evidenceLink && <p className="text-sm text-destructive mt-1">{form.formState.errors.evidenceLink.message}</p>}
                  </div>
                </div>
                <div>
                    <Label htmlFor="deliverables">Deliverables</Label>
                    <Textarea id="deliverables" {...form.register("deliverables")} className="mt-1 min-h-[80px]" />
                </div>
                <div>
                    <Label htmlFor="notes">Notes/Remarks</Label>
                    <Textarea id="notes" {...form.register("notes")} className="mt-1 min-h-[100px]" />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <DetailItem icon={Clock} label="Start Date" value={task.startDate && isValid(new Date(task.startDate)) ? format(new Date(task.startDate), 'PPP p') : 'N/A'} />
                <DetailItem icon={Clock} label="End Date (Due)" value={task.endDate && isValid(new Date(task.endDate)) ? format(new Date(task.endDate), 'PPP p') : 'N/A'} />
                <DetailItem icon={Users} label="Responsible Role(s)" value={displayResponsibleRole(task.responsibleRole)} />
                <DetailItem icon={User} label="Assigned Staff" value={task.assignedStaff} />
                <DetailItem icon={CheckSquare} label="Validator" value={task.validator} />
                <DetailItem icon={Repeat} label="Frequency" value={task.frequency} />
                <DetailItem icon={Percent} label="Progress" value={`${task.progress}%`} />
                <DetailItem icon={Milestone} label="Last Resolved On" value={task.lastCompletedOn && isValid(new Date(task.lastCompletedOn)) ? format(new Date(task.lastCompletedOn), 'PPP p') : 'N/A'} />
                <DetailItem icon={UserCheck} label="Resolved By" value={task.completedBy} />
                <DetailItem icon={CheckSquare} label="Validator Approval" value={task.validatorApproval} />
                <DetailItem icon={BookOpen} label="Compliance Chapter" value={task.complianceChapterTag} />
                <DetailItem 
                  icon={LinkIcon} 
                  label="Evidence" 
                  value={
                    task.evidenceLink ? (
                      <a href={task.evidenceLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline flex items-center">
                        View Evidence <ExternalLink className="ml-1 h-4 w-4" />
                      </a>
                    ) : (
                      <span className="italic text-muted-foreground">No evidence attached</span>
                    )
                  }
                  action={
                    <Button type="button" variant="ghost" size="sm" onClick={() => onOpenAttachEvidence(task)}>
                      <Paperclip className="mr-1 h-4 w-4" /> {task.evidenceLink ? 'Edit' : 'Attach'}
                    </Button>
                  }
                />
                <div className="md:col-span-2">
                  <DetailItem icon={ListChecks} label="Deliverables" value={task.deliverables ? <span className="whitespace-pre-wrap">{task.deliverables}</span> : 'N/A'} />
                </div>
                <div className="md:col-span-2">
                  <DetailItem icon={Edit3} label="Notes/Remarks" value={task.notes ? <span className="whitespace-pre-wrap">{task.notes}</span> : 'N/A'} />
                </div>
              </div>
            )}

            <Separator />
            <div>
              <h4 className="text-lg font-semibold mb-3">Activity Log</h4>
              {task.activities && task.activities.length > 0 ? (
                <ScrollArea className="h-[150px] border rounded-md p-3 bg-muted/50">
                  <ul className="space-y-3">
                    {task.activities.slice().reverse().map((activity, index) => ( // Display newest first
                      <li key={index} className="text-xs">
                        <p className="font-medium">
                          {activity.user} - {activity.action}
                          <span className="text-muted-foreground ml-2">({activity.timestamp && isValid(new Date(activity.timestamp)) ? format(new Date(activity.timestamp), 'PPp') : 'Invalid Date'})</span>
                        </p>
                        {activity.details && <p className="text-muted-foreground pl-2">{activity.details}</p>}
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">No activities logged yet.</p>
              )}
            </div>
          
            <DialogFooter className="pt-4 border-t">
              {isEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  <Edit3 className="mr-2 h-4 w-4" /> Edit Task
                </Button>
              )}
              <DialogClose asChild>
                 <Button type="button" variant="ghost" onClick={onClose}>Close</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
