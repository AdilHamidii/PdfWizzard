"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Github, Twitter, Linkedin } from "lucide-react";

export default function Page() {
  const [dark, setDark] = useState(false);
  const [docType, setDocType] = useState("cover_letter");
  const [prompt, setPrompt] = useState("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState<any>({
    your_name: "",
    your_email: "",
    recipient_name: "",
    recipient_company: "",
    subject_or_role: "",
    location: "",
    date: new Date().toISOString().slice(0, 10),
    title: "",
    skills_csv: "",
    links_csv: "",
    seller: "",
    client: "",
    invoice_number: "",
    invoice_items: [] as { desc: string; qty: number; price: number }[],
  });

  const updateField = (key: string, value: string) =>
    setFields((prev: any) => ({ ...prev, [key]: value }));

  const updateItem = (index: number, key: string, value: any) =>
    setFields((prev: any) => {
      const items = [...prev.invoice_items];
      items[index] = { ...items[index], [key]: value };
      return { ...prev, invoice_items: items };
    });

  const addItem = () =>
    setFields((prev: any) => ({
      ...prev,
      invoice_items: [...prev.invoice_items, { desc: "", qty: 1, price: 0 }],
    }));

  const removeItem = (index: number) =>
    setFields((prev: any) => ({
      ...prev,
      invoice_items: prev.invoice_items.filter((_: any, i: number) => i !== index),
    }));

  const invoiceTotal = fields.invoice_items.reduce(
    (sum: number, item: any) => sum + item.qty * item.price,
    0
  );

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, prompt, fields }),
      });

      const data = await res.json();
      if (!data.pdf) throw new Error("No PDF returned");

      const binary = atob(data.pdf);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      const blob = new Blob([bytes], { type: "application/pdf" });
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      {/* HEADER */}
      <header className="w-full h-14 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">PDFWizzard</h1>
        <Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </Button>
      </header>

      {/* MAIN */}
      <main className="h-[calc(100vh-6.5rem)] w-screen flex bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">

        {/*overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="h-16 w-16 rounded-full border-4 border-gray-400 dark:border-gray-500 border-t-blue-500 dark:border-t-blue-400"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <motion.p
                className="mt-4 text-gray-700 dark:text-gray-300 font-medium"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                Generating your PDF...
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/*LEFT PANEL*/}
        <div className="w-1/2 h-full overflow-y-auto p-10 border-r border-gray-200 dark:border-gray-800">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl">
              <CardHeader>
                <CardTitle className="text-gray-800 dark:text-gray-200 text-xl font-semibold tracking-tight">
                  Create Document
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cover_letter">Cover Letter</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="cv">CV</SelectItem>
                      <SelectItem value="invoice">Invoice</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={docType}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    {docType === "cover_letter" && (
                      <Grid>
                        <Field label="Your Name" v={fields.your_name} s="your_name" u={updateField} />
                        <Field label="Your Email" v={fields.your_email} s="your_email" u={updateField} />
                        <Field label="Recipient Name" v={fields.recipient_name} s="recipient_name" u={updateField} />
                        <Field label="Recipient Company" v={fields.recipient_company} s="recipient_company" u={updateField} />
                        <Field label="Role / Subject" v={fields.subject_or_role} s="subject_or_role" u={updateField} />
                        <Field label="Location" v={fields.location} s="location" u={updateField} />
                        <Field label="Date" type="date" v={fields.date} s="date" u={updateField} />
                      </Grid>
                    )}

                    {docType === "letter" && (
                      <Grid>
                        <Field label="Your Name" v={fields.your_name} s="your_name" u={updateField} />
                        <Field label="Recipient Name" v={fields.recipient_name} s="recipient_name" u={updateField} />
                        <Field label="Subject" v={fields.subject_or_role} s="subject_or_role" u={updateField} />
                        <Field label="Date" type="date" v={fields.date} s="date" u={updateField} />
                      </Grid>
                    )}

                    {docType === "cv" && (
                      <Grid>
                        <Field label="Your Name" v={fields.your_name} s="your_name" u={updateField} />
                        <Field label="Title" v={fields.title} s="title" u={updateField} />
                        <Field label="Skills (comma separated)" v={fields.skills_csv} s="skills_csv" u={updateField} />
                        <Field label="Links (comma separated)" v={fields.links_csv} s="links_csv" u={updateField} />
                      </Grid>
                    )}

                    {docType === "invoice" && (
                      <div className="space-y-4">
                        <Grid>
                          <Field label="Your / Company Name" v={fields.seller} s="seller" u={updateField} />
                          <Field label="Client" v={fields.client} s="client" u={updateField} />
                          <Field label="Invoice Number" v={fields.invoice_number} s="invoice_number" u={updateField} />
                          <Field label="Date" type="date" v={fields.date} s="date" u={updateField} />
                        </Grid>

                        <Label className="font-medium text-sm opacity-80">Line Items</Label>
                        <div className="space-y-3">
                          {fields.invoice_items.map((item: any, i: number) => (
                            <div key={i} className="grid grid-cols-5 gap-2 items-center">
                              <Input placeholder="Description" value={item.desc} onChange={(e) => updateItem(i, "desc", e.target.value)} className="col-span-2" />
                              <Input type="number" value={item.qty} onChange={(e) => updateItem(i, "qty", Number(e.target.value))} />
                              <Input type="number" value={item.price} onChange={(e) => updateItem(i, "price", Number(e.target.value))} />
                              <Button variant="ghost" onClick={() => removeItem(i)}>✕</Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm" onClick={addItem}>Add Item</Button>
                          <div className="text-right font-medium pt-1">
                            Total: {invoiceTotal.toFixed(2)} €
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="space-y-2">
                  <Label>Your Input</Label>
                  <Textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
                </div>

                <Button onClick={generate} disabled={loading} className="w-full bg-gray-900 hover:bg-black text-white dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900">
                  Generate PDF
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/*PREVIEW*/}
        <div className="w-1/2 h-full p-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {pdfUrl ? (
              <motion.iframe
                key={pdfUrl}
                src={pdfUrl}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full rounded-xl border border-gray-300 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900"
              />
            ) : (
              <motion.div initial={{ opacity: 0.4 }} animate={{ opacity: 0.6 }} className="text-center text-gray-500 dark:text-gray-400">
                <p className="text-lg font-medium">PDF Preview</p>
                <p className="text-sm">Generate a document to view it</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/*FOOTER*/}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/50 backdrop-blur-xl">
        <div>© {new Date().getFullYear()} PDFWizzard.fr — Built with ❤️</div>
        <div className="flex items-center gap-4">
          <a href="https://github.com/" target="_blank" className="hover:text-blue-600"><Github className="h-5 w-5" /></a>
          <a href="https://twitter.com/" target="_blank" className="hover:text-blue-500"><Twitter className="h-5 w-5" /></a>
          <a href="https://linkedin.com/" target="_blank" className="hover:text-blue-700"><Linkedin className="h-5 w-5" /></a>
          <a
            href="https://www.buymeacoffee.com/"
            target="_blank"
            className="ml-4 px-3 py-1 rounded-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-xs"
          >
            ☕ Buy me a coffee
          </a>
        </div>
      </footer>
    </div>
  );
}

function Grid({ children }: any) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function Field({ label, v, s, u, type = "text" }: any) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      <Input type={type} value={v} onChange={(e) => u(s, e.target.value)} />
    </div>
  );
}
