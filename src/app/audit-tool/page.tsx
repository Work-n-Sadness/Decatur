
"use client";

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { mockAuditCategories } from '@/lib/mock-data';
import type { AuditCategory, AuditItem } from '@/types';
import { Save, Edit3, Upload, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AuditToolPage() {
  const [auditData, setAuditData] = useState<AuditCategory[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching audit data
    setAuditData(mockAuditCategories.map(category => ({
      ...category,
      items: category.items.map(item => ({ ...item, isEditing: false })) // Add editing state
    })));
  }, []);

  const handleComplianceChange = (categoryId: string, itemId: string, compliant: boolean | null) => {
    setAuditData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId ? { ...item, compliant } : item
              ),
            }
          : category
      )
    );
  };

  const handleNotesChange = (categoryId: string, itemId: string, notes: string) => {
    setAuditData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId ? { ...item, notes } : item
              ),
            }
          : category
      )
    );
  };
  
  const toggleEditItem = (categoryId: string, itemId: string) => {
     setAuditData(prevData =>
      prevData.map(category =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map(item =>
                item.id === itemId ? { ...item, isEditing: !((item as any).isEditing) } : item
              ),
            }
          : category
      )
    );
  };

  const handleSaveAudit = () => {
    console.log("Saving audit data:", auditData);
    toast({
      title: "Audit Saved",
      description: "Your audit findings have been successfully saved.",
    });
    // In a real app, send this to a server
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Comprehensive Audit Tool</CardTitle>
          <CardDescription>
            Conduct audits based on the Leading Age Colorado Assisted Living Residence Survey Checklist Manual.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full space-y-4">
            {auditData.map(category => (
              <AccordionItem value={category.id} key={category.id} className="border rounded-lg overflow-hidden">
                <AccordionTrigger className="bg-muted/50 hover:bg-muted/80 px-4 py-3 text-lg font-medium">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent className="p-4 space-y-4 bg-background">
                  {category.items.map(item => (
                    <Card key={item.id} className="shadow-sm">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <p className="font-medium text-foreground leading-snug">{item.description}</p>
                          <Button variant="ghost" size="sm" onClick={() => toggleEditItem(category.id, item.id)}>
                            <Edit3 className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                        
                        {(item as any).isEditing ? (
                          <div className="space-y-3 pt-2 border-t mt-2">
                            <div className="flex items-center space-x-4">
                              <Label>Compliance Status:</Label>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`compliant-${item.id}`}
                                  checked={item.compliant === true}
                                  onCheckedChange={(checked) => handleComplianceChange(category.id, item.id, checked ? true : (item.compliant === false ? false : null))}
                                />
                                <Label htmlFor={`compliant-${item.id}`}>Compliant</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`noncompliant-${item.id}`}
                                  checked={item.compliant === false}
                                  onCheckedChange={(checked) => handleComplianceChange(category.id, item.id, checked ? false : (item.compliant === true ? true : null))}
                                />
                                <Label htmlFor={`noncompliant-${item.id}`}>Non-Compliant</Label>
                              </div>
                            </div>
                            <Textarea
                              placeholder="Notes and findings..."
                              value={item.notes}
                              onChange={(e) => handleNotesChange(category.id, item.id, e.target.value)}
                              className="min-h-[80px]"
                            />
                            <div className="flex items-center space-x-2">
                                <Input type="file" id={`evidence-${item.id}`} className="text-sm" />
                                <Label htmlFor={`evidence-${item.id}`} className="text-sm text-muted-foreground cursor-pointer">
                                    <Button variant="outline" size="sm" asChild>
                                        <span><Upload className="h-3 w-3 mr-1.5" /> Upload Evidence</span>
                                    </Button>
                                </Label>
                            </div>
                          </div>
                        ) : (
                           <div className="pt-2 border-t mt-2 space-y-2">
                             <div className="flex items-center">
                                <Label className="w-32 shrink-0">Status:</Label>
                                {item.compliant === true && <span className="text-sm text-green-600 font-medium">Compliant</span>}
                                {item.compliant === false && <span className="text-sm text-red-600 font-medium flex items-center"><AlertCircle className="h-4 w-4 mr-1" />Non-Compliant</span>}
                                {item.compliant === null && <span className="text-sm text-gray-500">Not Audited</span>}
                             </div>
                             {item.notes && (
                                <div className="flex items-start">
                                   <Label className="w-32 shrink-0">Notes:</Label>
                                   <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.notes}</p>
                                </div>
                             )}
                             {item.evidence && (
                                <div className="flex items-center">
                                   <Label className="w-32 shrink-0">Evidence:</Label>
                                   <a href={item.evidence} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">View Evidence</a>
                                </div>
                             )}
                           </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSaveAudit} size="lg">
              <Save className="mr-2 h-5 w-5" /> Save Audit Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
