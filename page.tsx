"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Internship {
  id: string
  name: string
  link: string
  deadline: string
  applicationStatus: "Not Started" | "Pending" | "Completed"
  resultStatus: "Selected" | "Not Selected" | ""
}

export default function InternshipTracker() {
  const [internships, setInternships] = useState<Internship[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("internships")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [newInternship, setNewInternship] = useState<Omit<Internship, "id">>({
    name: "",
    link: "",
    deadline: "",
    applicationStatus: "Not Started",
    resultStatus: "",
  })

  useEffect(() => {
    localStorage.setItem("internships", JSON.stringify(internships))
  }, [internships])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInternship((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setNewInternship((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddInternship = () => {
    if (!newInternship.name || !newInternship.deadline) return

    const newItem: Internship = {
      ...newInternship,
      id: Date.now().toString(),
    }

    setInternships((prev) => [...prev, newItem])
    setNewInternship({
      name: "",
      link: "",
      deadline: "",
      applicationStatus: "Not Started",
      resultStatus: "",
    })
  }

  const handleDeleteInternship = (id: string) => {
    setInternships((prev) => prev.filter((item) => item.id !== id))
  }

  const handleStatusChange = (id: string, field: string, value: string) => {
    setInternships((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const formatDateInput = (value: string) => {
    // Remove non-numeric characters
    let numbers = value.replace(/\D/g, "")

    // Add slashes for DD/MM/YYYY format
    if (numbers.length > 4) {
      numbers = `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`
    } else if (numbers.length > 2) {
      numbers = `${numbers.slice(0, 2)}/${numbers.slice(2)}`
    }

    return numbers
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedDate = formatDateInput(e.target.value)
    setNewInternship((prev) => ({ ...prev, deadline: formattedDate }))
  }

  const activeInternships = internships.filter((item) => item.applicationStatus !== "Completed")

  const completedInternships = internships.filter((item) => item.applicationStatus === "Completed")

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-6">Summer Internship Application Tracker</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Internship Application</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Internship Name</Label>
              <Input
                id="name"
                name="name"
                value={newInternship.name}
                onChange={handleInputChange}
                placeholder="Company Name / Position"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="link">Application Link</Label>
              <Input
                id="link"
                name="link"
                value={newInternship.link}
                onChange={handleInputChange}
                placeholder="https://example.com/apply"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline (DD/MM/YYYY)</Label>
              <Input
                id="deadline"
                name="deadline"
                value={newInternship.deadline}
                onChange={handleDateChange}
                placeholder="DD/MM/YYYY"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="applicationStatus">Application Status</Label>
              <Select
                value={newInternship.applicationStatus}
                onValueChange={(value) => handleSelectChange("applicationStatus", value)}
              >
                <SelectTrigger id="applicationStatus">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="resultStatus">Result Status</Label>
              <Select
                value={newInternship.resultStatus}
                onValueChange={(value) => handleSelectChange("resultStatus", value)}
              >
                <SelectTrigger id="resultStatus">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Selected">Selected</SelectItem>
                  <SelectItem value="Not Selected">Not Selected</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddInternship} className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Application
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({internships.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeInternships.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedInternships.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <InternshipTable
            internships={internships}
            onDelete={handleDeleteInternship}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="active">
          <InternshipTable
            internships={activeInternships}
            onDelete={handleDeleteInternship}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>

        <TabsContent value="completed">
          <InternshipTable
            internships={completedInternships}
            onDelete={handleDeleteInternship}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface InternshipTableProps {
  internships: Internship[]
  onDelete: (id: string) => void
  onStatusChange: (id: string, field: string, value: string) => void
}

function InternshipTable({ internships, onDelete, onStatusChange }: InternshipTableProps) {
  if (internships.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No internship applications found.</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <ScrollArea className="h-[500px] w-full">
        <div className="w-full overflow-auto">
          <table className="w-full border-collapse">
            <thead className="bg-muted sticky top-0">
              <tr>
                <th className="p-3 text-left font-medium">Internship Name</th>
                <th className="p-3 text-left font-medium">Application Link</th>
                <th className="p-3 text-left font-medium">Deadline</th>
                <th className="p-3 text-left font-medium">Application Status</th>
                <th className="p-3 text-left font-medium">Result Status</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {internships.map((internship) => (
                <tr key={internship.id} className="border-t">
                  <td className="p-3">{internship.name}</td>
                  <td className="p-3">
                    {internship.link ? (
                      <a
                        href={internship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        Link
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3">{internship.deadline}</td>
                  <td className="p-3">
                    <Select
                      value={internship.applicationStatus}
                      onValueChange={(value) => onStatusChange(internship.id, "applicationStatus", value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Select
                      value={internship.resultStatus}
                      onValueChange={(value) => onStatusChange(internship.id, "resultStatus", value)}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Pending" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Selected">Selected</SelectItem>
                        <SelectItem value="Not Selected">Not Selected</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(internship.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ScrollArea>
    </Card>
  )
}
