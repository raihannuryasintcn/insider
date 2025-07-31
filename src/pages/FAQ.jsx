import { useState } from "react";

const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex justify-between w-full text-left text-gray-800 text-xl font-semibold hover:text-blue-600"
      >
        <span>{question}</span>
        <span>{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600 text-md">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function FAQ() {
  const faqList = [
    {
      question: "Apakah Insider?",
      answer:
        'Platform Competitive Intelligence (CI) TIF “INSIDER” ini didevelop dengan menggunakan digital platform dengan teknologi Artificial Intelligence (AI) dalam melakukan profiling market, serta menggunakan resource IT berupa Power BI Pro, JavaScript Framework, SQL Database serta API Integration dalam Visualisasi data CI tersebut.',
    },
    {
      question: "Apa manfaat Insider?",
      answer:
        'Analyzing Market Profile by Integrated Data Profiling to Enhance TIF Business Positioning in Indonesia.',
    },
  ];

  return (
    <section className="mx-auto p-6 bg-white  ">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
      {faqList.map((faq, index) => (
        <FaqItem key={index} question={faq.question} answer={faq.answer} />
      ))}
    </section>
  );
}
