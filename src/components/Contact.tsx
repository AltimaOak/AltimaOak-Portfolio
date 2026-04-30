"use client";

import Section from "./Section";
import profileData from "@/data/profile.json";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { GitHub, LinkedIn } from "@/components/Icons";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    
    setStatus("loading");
    
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <Section id="contact">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item} className="mb-8">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              — Contact
            </span>
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
              Any Type Of Query<br/>& Discussion.
            </h2>
          </motion.div>
          <motion.p variants={item} className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-md">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </motion.p>

          <div className="space-y-6">
            <motion.div variants={item}>
              <ContactInfo icon={<Mail />} title="Email" value={profileData.contact.email} link={`mailto:${profileData.contact.email}`} />
            </motion.div>
            <motion.div variants={item}>
              <ContactInfo icon={<Phone />} title="Phone" value={profileData.contact.phone} link={`tel:${profileData.contact.phone}`} />
            </motion.div>
            <motion.div variants={item}>
              <ContactInfo icon={<MapPin />} title="Location" value={profileData.contact.location} />
            </motion.div>
          </div>

          <motion.div variants={item} className="flex gap-4 mt-12">
            <SocialButton icon={<GitHub />} link={profileData.contact.github} color="primary" />
            <SocialButton icon={<LinkedIn />} link={profileData.contact.linkedin} color="accent" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 md:p-12 bg-card border-none shadow-none relative overflow-hidden"
        >
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-[10px] ml-1">Name</label>
                <Input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="John Doe" 
                  className="bg-background border-none focus-visible:ring-1 focus-visible:ring-primary h-14 rounded-none transition-all" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-[10px] ml-1">Email</label>
                <Input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="john@example.com" 
                  className="bg-background border-none focus-visible:ring-1 focus-visible:ring-primary h-14 rounded-none transition-all" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-[10px] ml-1">Subject</label>
              <Input 
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                placeholder="Project Inquiry" 
                className="bg-background border-none focus-visible:ring-1 focus-visible:ring-primary h-14 rounded-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider text-[10px] ml-1">Message</label>
              <Textarea 
                required
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Tell me about your project..." 
                className="bg-background border-none focus-visible:ring-1 focus-visible:ring-primary min-h-[150px] rounded-none transition-all resize-none" 
              />
            </div>
            
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button 
                type="submit"
                disabled={status === "loading"}
                className={`w-full h-14 rounded-none text-lg font-bold flex items-center justify-center group transition-all mt-4 ${
                  status === "success" ? "bg-green-600 hover:bg-green-700" : 
                  status === "error" ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"
                }`}
              >
                {status === "loading" ? "Sending..." : 
                 status === "success" ? "Message Sent!" : 
                 status === "error" ? "Error Sending!" : "Send Message"}
                {status === "idle" && <Send className="ml-3 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                {status === "success" && <CheckCircle className="ml-3 w-4 h-4" />}
                {status === "error" && <AlertCircle className="ml-3 w-4 h-4" />}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </Section>
  );
}

function ContactInfo({ icon, title, value, link }: { icon: any, title: string, value: string, link?: string }) {
  const content = (
    <div className="flex items-center gap-6 group">
      <div className="w-14 h-14 rounded-none bg-card flex items-center justify-center text-muted-foreground group-hover:text-primary transition-all">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{title}</p>
        <p className="text-lg font-medium text-foreground group-hover:text-primary transition-colors underline-offset-4 group-hover:underline">{value}</p>
      </div>
    </div>
  );

  return link ? <a href={link}>{content}</a> : content;
}

function SocialButton({ icon, link, color }: { icon: any, link: string, color: string }) {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-14 h-14 bg-card rounded-none flex items-center justify-center transition-all hover:-translate-y-1 text-muted-foreground hover:text-primary"
    >
      {icon}
    </a>
  );
}
