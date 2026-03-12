"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Mail, User, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(EMAILJS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lib_version: "4.4.1",
          user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
          service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          template_params: {
            name: fields.name,
            email: fields.email,
            message: fields.message,
          },
        }),
      });

      if (!res.ok) throw new Error(`EmailJS error: ${res.status}`);

      setSubmitted(true);
      toast.success("Message sent! We'll get back to you soon.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex flex-col items-center px-4 py-16">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-3">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-sm">
            Have questions or feedback? Drop us a message.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-8 gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
                <Check className="w-6 h-6 text-accent" />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold text-foreground mb-1">Message Sent!</h2>
                <p className="text-sm text-muted-foreground">
                  Thanks for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSubmitted(false); setFields({ name: "", email: "", message: "" }); }}
                className="mt-2"
              >
                Send another
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  required
                  value={fields.name}
                  onChange={handleChange}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  required
                  value={fields.email}
                  onChange={handleChange}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us what's on your mind..."
                  required
                  rows={4}
                  value={fields.message}
                  onChange={handleChange}
                  className="bg-background resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                ) : (
                  <>
                    Send Message
                    <Send className="w-3.5 h-3.5 ml-1.5" />
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
