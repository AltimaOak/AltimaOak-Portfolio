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
    <Section id="contact" className="py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <motion.div variants={item} className="mb-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#202124]">
              Any Type Of Query<br />&amp; Discussion.
            </h2>
          </motion.div>
          <motion.p variants={item} className="text-base text-[#6B7280] mb-8 leading-relaxed max-w-md">
            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your visions.
          </motion.p>

          <div className="space-y-4">
            <motion.div variants={item}>
              <ContactInfo icon={<Mail className="w-5 h-5 text-primary" />} title="Email" value={profileData.contact.email} link={`mailto:${profileData.contact.email}`} />
            </motion.div>
            <motion.div variants={item}>
              <ContactInfo icon={<Phone className="w-5 h-5 text-primary" />} title="Phone" value={profileData.contact.phone} link={`tel:${profileData.contact.phone}`} />
            </motion.div>
            <motion.div variants={item}>
              <ContactInfo icon={<MapPin className="w-5 h-5 text-primary" />} title="Location" value={profileData.contact.location} />
            </motion.div>
          </div>

          <motion.div variants={item} className="flex gap-4 mt-8">
            <SocialButton icon={<GitHub className="w-5 h-5" />} link={profileData.contact.github} color="primary" />
            <SocialButton icon={<LinkedIn className="w-5 h-5" />} link={profileData.contact.linkedin} color="accent" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 md:p-10 bg-[#FFFFFF] border border-[#F0E3D6] rounded-xl shadow-xs relative overflow-hidden"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1">Name</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter Your Name"
                  className="bg-[#FAF6F0] border border-[#F0E3D6] focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-xl text-sm transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1">Email</label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter Your Email"
                  className="bg-[#FAF6F0] border border-[#F0E3D6] focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-xl text-sm transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1">Subject</label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Project Inquiry"
                className="bg-[#FAF6F0] border border-[#F0E3D6] focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-xl text-sm transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider ml-1">Message</label>
              <Textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project..."
                className="bg-[#FAF6F0] border border-[#F0E3D6] focus-visible:ring-1 focus-visible:ring-primary min-h-[140px] rounded-xl text-sm transition-all resize-none"
              />
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                type="submit"
                disabled={status === "loading"}
                className={`w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center group transition-all mt-2 shadow-sm ${status === "success" ? "bg-green-600 hover:bg-green-700 text-white" :
                    status === "error" ? "bg-red-600 hover:bg-red-700 text-white" : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                  }`}
              >
                {status === "loading" ? "Sending..." :
                  status === "success" ? "Message Sent!" :
                    status === "error" ? "Error Sending!" : "Send Message"}
                {status === "idle" && <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                {status === "success" && <CheckCircle className="ml-2 w-4 h-4" />}
                {status === "error" && <AlertCircle className="ml-2 w-4 h-4" />}
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
    <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FFFFFF] border border-[#F0E3D6] shadow-xs group hover:border-primary/40 transition-colors">
      <div className="w-11 h-11 rounded-lg bg-[#FFF0E4] flex items-center justify-center text-primary shrink-0">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">{title}</p>
        <p className="text-base font-semibold text-[#202124] group-hover:text-primary transition-colors truncate">{value}</p>
      </div>
    </div>
  );

  return link ? <a href={link} className="block">{content}</a> : content;
}

function SocialButton({ icon, link, color }: { icon: any, link: string, color: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="w-12 h-12 bg-[#FFFFFF] border border-[#F0E3D6] rounded-xl flex items-center justify-center transition-all hover:-translate-y-0.5 text-[#202124] hover:text-primary hover:border-primary/40 shadow-xs"
    >
      {icon}
    </a>
  );
}
