'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

export default function RSVPPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    peopleCount: 1,
    childrenCount: 0,
    peopleNames: [] as string[],
    childrenNames: [] as string[],
    events: {
      bhopal: false,
      ayodhya: false,
    },
    relationshipToCouple: 'BRIDE_RELATIVE',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (
      !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))
    ) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (formData.peopleCount < 1) {
      newErrors.peopleCount = 'At least 1 person is required';
    }

    if (formData.childrenCount < 0) {
      newErrors.childrenCount = 'Children count cannot be negative';
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
      newErrors.events = 'Please select at least one event';
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
      ', '
    );

    // Create names list for children
    const childrenNamesList = formData.childrenNames
      .slice(0, formData.childrenCount)
      .join(', ');

    // Create events list with dates
    const selectedEvents = [];
    const eventDates = [];
    if (formData.events.bhopal) {
      selectedEvents.push('Bhopal');
      eventDates.push('21–22 Nov');
    }
    if (formData.events.ayodhya) {
      selectedEvents.push('Ayodhya');
      eventDates.push('24–26 Nov');
    }
    const eventsList = selectedEvents.join(' and ');
    const datesList = eventDates.join(' and ');

    // Relationship mapping
    const relationshipMap = {
      BRIDE_RELATIVE: "Bride's Relative",
      GROOM_RELATIVE: "Groom's Relative",
      BRIDE_FRIEND: "Bride's Close Friend",
      GROOM_FRIEND: "Groom's Close Friend",
      OTHER: 'Family Friend / Other',
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
    const phoneNumber = '971565912018';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const updatePeopleCount = (increment: boolean) => {
    const newCount = increment
      ? formData.peopleCount + 1
      : Math.max(1, formData.peopleCount - 1);

    // Update people names array - we only store additional people names (beyond the first)
    const newPeopleNames = [...formData.peopleNames];
    if (increment) {
      newPeopleNames.push('');
    } else {
      newPeopleNames.pop();
    }

    setFormData((prev) => ({
      ...prev,
      peopleCount: newCount,
      peopleNames: newPeopleNames,
    }));

    if (errors.peopleCount) {
      setErrors((prev) => ({ ...prev, peopleCount: '' }));
    }
  };

  const updateChildrenCount = (increment: boolean) => {
    const newCount = increment
      ? formData.childrenCount + 1
      : Math.max(0, formData.childrenCount - 1);

    // Update children names array
    const newChildrenNames = [...formData.childrenNames];
    if (increment) {
      newChildrenNames.push('');
    } else {
      newChildrenNames.pop();
    }

    setFormData((prev) => ({
      ...prev,
      childrenCount: newCount,
      childrenNames: newChildrenNames,
    }));

    if (errors.childrenCount) {
      setErrors((prev) => ({ ...prev, childrenCount: '' }));
    }
  };

  const updatePeopleName = (index: number, value: string) => {
    const newPeopleNames = [...formData.peopleNames];
    newPeopleNames[index] = value;
    setFormData((prev) => ({ ...prev, peopleNames: newPeopleNames }));

    // Clear error for this field
    if (errors[`peopleName_${index}`]) {
      setErrors((prev) => ({ ...prev, [`peopleName_${index}`]: '' }));
    }
  };

  const updateChildrenName = (index: number, value: string) => {
    const newChildrenNames = [...formData.childrenNames];
    newChildrenNames[index] = value;
    setFormData((prev) => ({ ...prev, childrenNames: newChildrenNames }));

    // Clear error for this field
    if (errors[`childrenName_${index}`]) {
      setErrors((prev) => ({ ...prev, [`childrenName_${index}`]: '' }));
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground">
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
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl md:text-5xl text-accent mb-4">
              RSVP
            </h1>
            <p className="text-foreground/80 text-lg">
              Please fill out the form below to confirm your attendance
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, name: e.target.value }));
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border bg-muted/20 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors ${
                  errors.name ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, phone: e.target.value }));
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: '' }));
                  }
                }}
                className={`w-full px-4 py-3 rounded-lg border bg-muted/20 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors ${
                  errors.phone ? 'border-destructive' : 'border-border'
                }`}
                placeholder="Enter your phone number"
              />
              {errors.phone && (
                <p className="text-destructive text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* People Count */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Number of People *
              </label>
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
                    {formData.peopleCount === 1 ? 'person' : 'people'}
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
                      <div key={index}>
                        <label
                          htmlFor={`peopleName_${index}`}
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Person {index + 2} Name *
                        </label>
                        <input
                          type="text"
                          id={`peopleName_${index}`}
                          value={formData.peopleNames[index] || ''}
                          onChange={(e) =>
                            updatePeopleName(index, e.target.value)
                          }
                          className={`w-full px-4 py-3 rounded-lg border bg-muted/20 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors ${
                            errors[`peopleName_${index}`]
                              ? 'border-destructive'
                              : 'border-border'
                          }`}
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
              <label className="block text-sm font-medium text-foreground mb-2">
                Number of Children (children under 18)
              </label>
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
                    {formData.childrenCount === 1 ? 'child' : 'children'}
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
                      <div key={index}>
                        <label
                          htmlFor={`childrenName_${index}`}
                          className="block text-sm font-medium text-foreground mb-1"
                        >
                          Child {index + 1} Name *
                        </label>
                        <input
                          type="text"
                          id={`childrenName_${index}`}
                          value={formData.childrenNames[index] || ''}
                          onChange={(e) =>
                            updateChildrenName(index, e.target.value)
                          }
                          className={`w-full px-4 py-3 rounded-lg border bg-muted/20 text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors ${
                            errors[`childrenName_${index}`]
                              ? 'border-destructive'
                              : 'border-border'
                          }`}
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

            {/* Events Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Which events will you attend? *
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.events.bhopal}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        events: { ...prev.events, bhopal: e.target.checked },
                      }));
                      if (errors.events) {
                        setErrors((prev) => ({ ...prev, events: '' }));
                      }
                    }}
                    className="w-5 h-5 text-accent bg-muted/20 border-2 border-border rounded focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  />
                  <span className="text-foreground">Bhopal (21–22 Nov)</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.events.ayodhya}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        events: { ...prev.events, ayodhya: e.target.checked },
                      }));
                      if (errors.events) {
                        setErrors((prev) => ({ ...prev, events: '' }));
                      }
                    }}
                    className="w-5 h-5 text-accent bg-muted/20 border-2 border-border rounded focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  />
                  <span className="text-foreground">Ayodhya (24–26 Nov)</span>
                </label>
              </div>
              {errors.events && (
                <p className="text-destructive text-sm mt-1">{errors.events}</p>
              )}
            </div>

            {/* Relationship to Couple */}
            <div>
              <label
                htmlFor="relationship"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Relationship to the couple *
              </label>
              <select
                id="relationship"
                value={formData.relationshipToCouple}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    relationshipToCouple: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 rounded-lg border bg-muted/20 text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors border-border"
              >
                <option value="BRIDE_RELATIVE">Bride&apos;s Relative</option>
                <option value="GROOM_RELATIVE">Groom&apos;s Relative</option>
                <option value="BRIDE_FRIEND">Bride&apos;s Close Friend</option>
                <option value="GROOM_FRIEND">Groom&apos;s Close Friend</option>
                <option value="OTHER">Family Friend / Other</option>
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg py-6 h-auto"
            >
              Send RSVP via WhatsApp
            </Button>
          </form>

          {/* Call Alternative */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground/60 mb-3">
              If you don&apos;t have WhatsApp, don&apos;t worry,{' '}
              <button
                onClick={() => window.open('tel:+971565912018', '_self')}
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
