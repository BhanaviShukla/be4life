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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create WhatsApp message
    const message = `Hi I am ${formData.name} and I am RSVPing for the wedding on 25th November 2025 for ${formData.peopleCount} people and ${formData.childrenCount} children.`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp URL
    const phoneNumber = '<enter phone number here>';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const updatePeopleCount = (increment: boolean) => {
    const newCount = increment
      ? formData.peopleCount + 1
      : Math.max(1, formData.peopleCount - 1);
    setFormData((prev) => ({ ...prev, peopleCount: newCount }));
    if (errors.peopleCount) {
      setErrors((prev) => ({ ...prev, peopleCount: '' }));
    }
  };

  const updateChildrenCount = (increment: boolean) => {
    const newCount = increment
      ? formData.childrenCount + 1
      : Math.max(0, formData.childrenCount - 1);
    setFormData((prev) => ({ ...prev, childrenCount: newCount }));
    if (errors.childrenCount) {
      setErrors((prev) => ({ ...prev, childrenCount: '' }));
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
            </div>

            {/* Children Count */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Number of Children
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

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground/60">
              You will be redirected to WhatsApp to send your RSVP
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
