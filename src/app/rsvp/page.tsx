"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Minus } from "lucide-react";

export default function RSVPPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    peopleCount: 1,
    childrenCount: 0,
    peopleNames: [] as string[],
    childrenNames: [] as string[],
    events: {
      bhopal: false,
      ayodhya: false,
    },
    relationshipToCouple: "BRIDE_RELATIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (formData.peopleCount < 1) {
      newErrors.peopleCount = "At least 1 person is required";
    }

    if (formData.childrenCount < 0) {
      newErrors.childrenCount = "Children count cannot be negative";
    }

    // Validate people names (only for additional people beyond the first)
    for (let i = 0; i < formData.peopleCount - 1; i++) {
      if (!formData.peopleNames[i]?.trim()) {
        newErrors[`peopleName_${i}`] = `Person ${i + 2} name is required`;
      }
    }

    // Validate children names
    for (let i = 0; i < formData.childrenCount; i++) {
      if (!formData.childrenNames[i]?.trim()) {
        newErrors[`childrenName_${i}`] = `Child ${i + 1} name is required`;
      }
    }

    // Validate that at least one event is selected
    if (!formData.events.bhopal && !formData.events.ayodhya) {
      newErrors.events = "Please select at least one event";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create names list for people (include main person + additional people)
    const additionalPeopleNames = formData.peopleNames
      .slice(0, formData.peopleCount - 1)
      .filter((name) => name.trim());
    const peopleNamesList = [formData.name, ...additionalPeopleNames].join(
      ", "
    );

    // Create names list for children
    const childrenNamesList = formData.childrenNames
      .slice(0, formData.childrenCount)
      .join(", ");

    // Create events list with dates
    const selectedEvents = [];
    const eventDates = [];
    if (formData.events.bhopal) {
      selectedEvents.push("Bhopal");
      eventDates.push("21–22 Nov");
    }
    if (formData.events.ayodhya) {
      selectedEvents.push("Ayodhya");
      eventDates.push("24–26 Nov");
    }
    const eventsList = selectedEvents.join(" and ");
    const datesList = eventDates.join(" and ");

    // Relationship mapping
    const relationshipMap = {
      BRIDE_RELATIVE: "Bride's Relative",
      GROOM_RELATIVE: "Groom's Relative",
      BRIDE_FRIEND: "Bride's Close Friend",
      GROOM_FRIEND: "Groom's Close Friend",
      OTHER: "Family Friend / Other",
    };

    // Create WhatsApp message
    const message = `Hi, I am *${
      formData.name
    }*, and I am RSVPing for **Eshlok & Bhanvi's wedding** — at *${eventsList}*, from *${datesList}*.

Relation to the couple: ${
      relationshipMap[
        formData.relationshipToCouple as keyof typeof relationshipMap
      ]
    }

Total guests in my group: ${formData.peopleCount + formData.childrenCount}
* Adults (18+): ${formData.peopleCount} — ${peopleNamesList}
* Children (below 18): ${formData.childrenCount} — ${childrenNamesList}

Primary contact number: ${formData.phone}

Please confirm that my RSVP has been received, and let me know if there are any details I should prepare before the events (such as ID proofs, accommodation arrangements, or travel timings).

Thank you!  
— ${formData.name}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const phoneNumber = "+919711545145";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  const updatePeopleCount = (increment: boolean) => {
    const newCount = increment
      ? formData.peopleCount + 1
      : Math.max(1, formData.peopleCount - 1);

    // Update people names array - we only store additional people names (beyond the first)
    const newPeopleNames = [...formData.peopleNames];
    if (increment) {
      newPeopleNames.push("");
    } else {
      newPeopleNames.pop();
    }

    setFormData((prev) => ({
      ...prev,
      peopleCount: newCount,
      peopleNames: newPeopleNames,
    }));

    if (errors.peopleCount) {
      setErrors((prev) => ({ ...prev, peopleCount: "" }));
    }
  };

  const updateChildrenCount = (increment: boolean) => {
    const newCount = increment
      ? formData.childrenCount + 1
      : Math.max(0, formData.childrenCount - 1);

    // Update children names array
    const newChildrenNames = [...formData.childrenNames];
    if (increment) {
      newChildrenNames.push("");
    } else {
      newChildrenNames.pop();
    }

    setFormData((prev) => ({
      ...prev,
      childrenCount: newCount,
      childrenNames: newChildrenNames,
    }));

    if (errors.childrenCount) {
      setErrors((prev) => ({ ...prev, childrenCount: "" }));
    }
  };

  const updatePeopleName = (index: number, value: string) => {
    const newPeopleNames = [...formData.peopleNames];
    newPeopleNames[index] = value;
    setFormData((prev) => ({ ...prev, peopleNames: newPeopleNames }));

    // Clear error for this field
    if (errors[`peopleName_${index}`]) {
      setErrors((prev) => ({ ...prev, [`peopleName_${index}`]: "" }));
    }
  };

  const updateChildrenName = (index: number, value: string) => {
    const newChildrenNames = [...formData.childrenNames];
    newChildrenNames[index] = value;
    setFormData((prev) => ({ ...prev, childrenNames: newChildrenNames }));

    // Clear error for this field
    if (errors[`childrenName_${index}`]) {
      setErrors((prev) => ({ ...prev, [`childrenName_${index}`]: "" }));
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground hero-textured">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          className="w-full max-w-md lg:max-w-2xl mx-auto bg-background/95 backdrop-blur-sm border border-border/50 rounded-2xl p-6 md:p-10 lg:p-12 shadow-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl text-accent mb-3">
              RSVP
            </h1>
            <p className="text-foreground/70 text-base">
              Please fill out the form below to confirm your attendance
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: "" }));
                  }
                }}
                className={errors.name ? "border-destructive" : ""}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: "" }));
                  }
                }}
                className={errors.phone ? "border-destructive" : ""}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Relationship to Couple */}
            <div className="space-y-2">
              <Label htmlFor="relationship">
                Relationship to the couple *
              </Label>
              <Select
                value={formData.relationshipToCouple}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    relationshipToCouple: value,
                  }))
                }
              >
                <SelectTrigger id="relationship">
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRIDE_RELATIVE">
                    Bride&apos;s Relative
                  </SelectItem>
                  <SelectItem value="GROOM_RELATIVE">
                    Groom&apos;s Relative
                  </SelectItem>
                  <SelectItem value="BRIDE_FRIEND">
                    Bride&apos;s Close Friend
                  </SelectItem>
                  <SelectItem value="GROOM_FRIEND">
                    Groom&apos;s Close Friend
                  </SelectItem>
                  <SelectItem value="OTHER">Family Friend / Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="border-t border-border/30 pt-6">
              <h3 className="font-serif text-lg text-foreground/90 mb-6">
                Guest Information
              </h3>
            </div>

            {/* People Count */}
            <div>
              <Label className="mb-3 block">Number of People *</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updatePeopleCount(false)}
                  disabled={formData.peopleCount <= 1}
                  className="h-12 w-12"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-2xl font-semibold text-foreground">
                    {formData.peopleCount}
                  </span>
                  <p className="text-sm text-foreground/60">
                    {formData.peopleCount === 1 ? "person" : "people"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updatePeopleCount(true)}
                  className="h-12 w-12"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.peopleCount && (
                <p className="text-destructive text-sm mt-1">
                  {errors.peopleCount}
                </p>
              )}

              {/* People Names */}
              {formData.peopleCount > 1 && (
                <div className="mt-4 space-y-3">
                  {Array.from(
                    { length: formData.peopleCount - 1 },
                    (_, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`peopleName_${index}`}>
                          Person {index + 2} Name *
                        </Label>
                        <Input
                          type="text"
                          id={`peopleName_${index}`}
                          value={formData.peopleNames[index] || ""}
                          onChange={(e) =>
                            updatePeopleName(index, e.target.value)
                          }
                          className={
                            errors[`peopleName_${index}`]
                              ? "border-destructive"
                              : ""
                          }
                          placeholder={`Enter person ${index + 2} name`}
                        />
                        {errors[`peopleName_${index}`] && (
                          <p className="text-destructive text-sm mt-1">
                            {errors[`peopleName_${index}`]}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Children Count */}
            <div>
              <Label className="mb-3 block">
                Number of Children (under 18)
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateChildrenCount(false)}
                  disabled={formData.childrenCount <= 0}
                  className="h-12 w-12"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="text-2xl font-semibold text-foreground">
                    {formData.childrenCount}
                  </span>
                  <p className="text-sm text-foreground/60">
                    {formData.childrenCount === 1 ? "child" : "children"}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => updateChildrenCount(true)}
                  className="h-12 w-12"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.childrenCount && (
                <p className="text-destructive text-sm mt-1">
                  {errors.childrenCount}
                </p>
              )}

              {/* Children Names */}
              {formData.childrenCount > 0 && (
                <div className="mt-4 space-y-3">
                  {Array.from(
                    { length: formData.childrenCount },
                    (_, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`childrenName_${index}`}>
                          Child {index + 1} Name *
                        </Label>
                        <Input
                          type="text"
                          id={`childrenName_${index}`}
                          value={formData.childrenNames[index] || ""}
                          onChange={(e) =>
                            updateChildrenName(index, e.target.value)
                          }
                          className={
                            errors[`childrenName_${index}`]
                              ? "border-destructive"
                              : ""
                          }
                          placeholder={`Enter child ${index + 1} name`}
                        />
                        {errors[`childrenName_${index}`] && (
                          <p className="text-destructive text-sm mt-1">
                            {errors[`childrenName_${index}`]}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border/30 pt-6">
              <h3 className="font-serif text-lg text-foreground/90 mb-6">
                Event Details
              </h3>
            </div>

            {/* Events Selection */}
            <div className="space-y-3">
              <Label>Which events will you attend? *</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="bhopal"
                    checked={formData.events.bhopal}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          bhopal: checked as boolean,
                        },
                      }));
                      if (errors.events) {
                        setErrors((prev) => ({ ...prev, events: "" }));
                      }
                    }}
                  />
                  <Label
                    htmlFor="bhopal"
                    className="cursor-pointer font-normal"
                  >
                    Bhopal (21–22 Nov)
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="ayodhya"
                    checked={formData.events.ayodhya}
                    onCheckedChange={(checked) => {
                      setFormData((prev) => ({
                        ...prev,
                        events: {
                          ...prev.events,
                          ayodhya: checked as boolean,
                        },
                      }));
                      if (errors.events) {
                        setErrors((prev) => ({ ...prev, events: "" }));
                      }
                    }}
                  />
                  <Label
                    htmlFor="ayodhya"
                    className="cursor-pointer font-normal"
                  >
                    Ayodhya (24–26 Nov)
                  </Label>
                </div>
              </div>
              {errors.events && (
                <p className="text-destructive text-sm mt-1">
                  {errors.events}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" size="default" className="w-full">
              Submit RSVP
            </Button>
          </form>

          {/* Call Alternative */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/60 mb-3">
              If you don&apos;t have WhatsApp, don&apos;t worry,{" "}
              <button
                onClick={() => window.open("tel:+971565912018", "_self")}
                className="text-accent hover:text-accent/80 underline font-medium transition-colors"
              >
                click here to call the planners
              </button>
            </p>
          </div>

          {/* Footer Note */}
          <div className="mt-4 text-center">
            <p className="text-sm text-foreground/60">
              You will be redirected to WhatsApp to send your RSVP
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
