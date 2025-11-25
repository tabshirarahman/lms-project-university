"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  const { register, handleSubmit, reset } = useForm();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      // In a real app, this would send to an email service or backend
      console.log("Contact form submitted:", data);
      setSubmitted(true);
      reset();
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      alert("Error sending message");
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have questions? We'd love to hear from you.
        </p>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <Card className="p-8">
              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name
                    </label>
                    <Input
                      {...register("name", { required: true })}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email
                    </label>
                    <Input
                      {...register("email", { required: true })}
                      type="email"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <Input
                    {...register("subject", { required: true })}
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    {...register("message", { required: true })}
                    placeholder="Your message"
                    rows={6}
                    className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-3">Email</h3>
              <a
                href="mailto:support@lmsplatform.com"
                className="text-primary hover:underline"
              >
                support@lmsplatform.com
              </a>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-3">Phone</h3>
              <p className="text-muted-foreground">+1 (555) 123-4567</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-3">Address</h3>
              <p className="text-muted-foreground">
                123 Education Boulevard
                <br />
                Learning City, LC 12345
                <br />
                United States
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold text-foreground mb-3">Hours</h3>
              <p className="text-sm text-muted-foreground">
                Monday - Friday: 9am - 6pm
                <br />
                Saturday: 10am - 4pm
                <br />
                Sunday: Closed
              </p>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
