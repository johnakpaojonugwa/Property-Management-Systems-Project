"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Image from "next/image";

export default function MortgagePage() {
  const faqs = [
    {
      question: "What is mortgage?",
      answer:
        "A mortgage is a loan used to purchase real estate, where the property itself serves as collateral for the loan.",
    },
    {
      question: "How long does it take to get the mortgage?",
      answer:
        "Mortgage approval typically takes between 2 to 4 weeks, depending on documentation and verification speed.",
    },
    {
      question: "Can I get an apartment directly with mortgage?",
      answer:
        "Yes, you can get an apartment directly through mortgage financing once your application is approved.",
    },
    {
      question: "Is it only apartment I can get with mortgage payment?",
      answer:
        "No, you can use mortgage financing to buy various types of properties including houses, duplexes, or land (where applicable).",
    },
    {
      question: "Must my mortgage monthly payment be 12 months?",
      answer:
        "Not necessarily. Mortgage payment terms are flexible and can range from a few years up to 25 years depending on your agreement.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-[#f9f9ff] mt-10 md:mt-25">
      <Nav />

      {/* Hero Section */}
      <section className="w-[90%] md:w-[85%] lg:w-[90%] xl:w-[60%] mx-auto flex flex-col md:flex-row items-center justify-between gap-10 py-16">
        {/* Text Section */}
        <div className="w-full md:w-1/2 space-y-5 text-center md:text-left">
          <h6 className="inline-block text-sm py-1 px-4 bg-purple-100 text-gray-700 rounded-full font-medium shadow-sm">
            Mortgage
          </h6>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-[#1d1d1d]">
            Smart Mortgage for{" "}
            <span className="text-[#3A2B66]">Diaspora Clients</span>
          </h1>

          <p className="text-base md:text-lg text-[#555] leading-relaxed max-w-md mx-auto md:mx-0">
            Calculate your mortgage eligibility and monthly payments for
            properties in Nigeria. Start your journey toward home ownership
            today.
          </p>

          <button className="mt-4 bg-[#3A2B66] hover:bg-teal-600 text-white px-7 py-3 rounded-lg font-semibold text-base md:text-lg transition duration-300 ease-in-out shadow-md hover:shadow-lg cursor-pointer">
            Learn More
          </button>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative group">
            <Image
              src="/Mortgage.png"
              alt="Mortgage illustration"
              width={550}
              height={500}
              priority
              className="rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </section>

      <section className="w-[90%] md:w-[85%] lg:w-[90%] xl:w-[60%] mx-auto my-10 md:my-30">
        <div className="text-card-foreground shadow-sm bg-white border border-[#E3E3E3] rounded-2xl p-5 md:p-8">
          <h1 className="md:text-4xl text-3xl leading-tight my-2 font-bold text-left">
            Mortgage Calculator
          </h1>
          <p className="text-base md:text-lg leading-relaxed md:leading-[1.56] text-[#444] mb-6">
            A mortgage is a loan specifically used to purchase real estate,
            where the <br /> property itself serves as collateral. Borrowers
            agree to repay the loan amount <br /> plus interest over a set
            period, typically 15 to 30 years.
          </p>
        </div>
      </section>
      {/* Mortgage Support Section */}
      <section>
        <div className="w-[90%] lg:w-[95%] xl:w-[60%] mx-auto flex flex-col lg:flex-row items-start gap-6 border border-gray-200 rounded-2xl shadow-md hover:shadow-md transition-all duration-300 flex flex-col items-start text-left p-6">
          <div className="w-full lg:w-1/2 p-4">
            <Image
              src="/New homeowners receiving keys.jpg"
              alt="New homeowners receiving keys"
              width={400}
              height={400}
              className="w-full md:w-full h-auto md:h-auto object-cover lg:object-cover rounded-xl lg:mb-6"
            />
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <h1 className="md:text-4xl text-3xl leading-tight my-2 font-bold text-left">
              Mortgage Support for Diaspora Buyers
            </h1>
            <p className="text-base md:text-lg leading-relaxed md:leading-[1.56] text-[#444] mb-6">
              Access mortgage financing designed for Nigerians living abroad,
              with simplified processes and competitive rates.
            </p>
            <ul className="space-y-3 mb-8 list-disc marker:text-gray-900">
              <li>
                Pre-approval in 48 hours
              </li>
              <li>
                Competitive interest rates from 15+ banks
              </li>
              <li>
                Up to 25-year payment terms
              </li>
              <li>
                Diaspora-friendly documentation process
              </li>
            </ul>
            <button className="mt-4 bg-[#3A2B66] hover:bg-teal-600 text-white px-7 py-3 rounded-lg font-semibold text-base md:text-md transition duration-300 ease-in-out shadow-md hover:shadow-lg cursor-pointer">
              Try Mortgage Calculator
            </button>
          </div>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="w-[90%] md:w-[80%] lg:w-[60%] mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-2">
            Frequently asked questions
          </h2>
          <p className="text-gray-500 mb-10">
            Everything you need to know about the product and billing.
          </p>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 bg-white shadow-sm"
              >
                <button
                  className="w-full flex justify-between items-center px-5 py-4 text-left text-gray-900 font-medium hover:bg-purple-100 transition"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <FiChevronDown
                    className={`text-xl transform transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>

                {openIndex === index && (
                  <div className=" pb-4 text-gray-600 text-left px-5 border-t border-gray-100 bg-gray-100">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Optional Footer */}
      <Footer />
    </main>
  );
}
