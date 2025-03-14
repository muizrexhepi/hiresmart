"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-[#023020] to-[#034530] py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-white mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-300 max-w-3xl">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              1. Introduction
            </h2>
            <p className="mb-6">
              Welcome to TvojPazar. These terms and conditions outline the rules
              and regulations for the use of TvojPazar&apos;s website. By
              accessing this website, we assume you accept these terms and
              conditions in full. Do not continue to use TvojPazar&apos;s
              website if you do not accept all of the terms and conditions
              stated on this page.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              2. License to Use
            </h2>
            <p className="mb-6">
              Unless otherwise stated, TvojPazar and/or its licensors own the
              intellectual property rights for all material on TvojPazar. All
              intellectual property rights are reserved. You may view and/or
              print pages from tvojpazar.mk for your own personal use subject to
              restrictions set in these terms and conditions.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              3. User Account
            </h2>
            <p className="mb-4">
              When you create an account with us, you guarantee that:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                The information you provide us is accurate, complete, and
                current at all times.
              </li>
              <li className="mb-2">
                You are responsible for maintaining the confidentiality of your
                account and password.
              </li>
              <li className="mb-2">
                You accept responsibility for all activities that occur under
                your account.
              </li>
              <li className="mb-2">
                You must notify us immediately upon becoming aware of any breach
                of security or unauthorized use of your account.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              4. Listing Rules
            </h2>
            <p className="mb-4">
              When posting listings on TvojPazar, you agree to the following:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                All listings must be accurate and truthful.
              </li>
              <li className="mb-2">
                You must have the legal right to sell the items you list.
              </li>
              <li className="mb-2">
                Listings must not violate any laws or regulations of Macedonia.
              </li>
              <li className="mb-2">
                Prohibited items include but are not limited to: illegal goods,
                counterfeit items, stolen property, hazardous materials, and
                items that infringe upon intellectual property rights.
              </li>
              <li className="mb-2">
                TvojPazar reserves the right to remove any listing that violates
                these terms or for any other reason at our sole discretion.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              5. User Conduct
            </h2>
            <p className="mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Violate any laws or regulations.</li>
              <li className="mb-2">
                Post unauthorized commercial communications.
              </li>
              <li className="mb-2">
                Engage in unlawful multi-level marketing.
              </li>
              <li className="mb-2">Submit malicious code or viruses.</li>
              <li className="mb-2">
                Solicit login information or access accounts belonging to
                others.
              </li>
              <li className="mb-2">Bully, intimidate, or harass any user.</li>
              <li className="mb-2">
                Post content that is hateful, threatening, pornographic, or that
                contains nudity or graphic violence.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              6. Limitation of Liability
            </h2>
            <p className="mb-6">
              TvojPazar shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of or
              inability to access or use the service.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              7. Indemnification
            </h2>
            <p className="mb-6">
              You agree to defend, indemnify, and hold harmless TvojPazar and
              its licensee and licensors, and their employees, contractors,
              agents, officers, and directors, from and against any and all
              claims, damages, obligations, losses, liabilities, costs or debt,
              and expenses, resulting from or arising out of your use and access
              of the Service.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              8. Termination
            </h2>
            <p className="mb-6">
              We may terminate or suspend your account and bar access to the
              Service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without limitation,
              including but not limited to a breach of the Terms.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              9. Governing Law
            </h2>
            <p className="mb-6">
              These Terms shall be governed and construed in accordance with the
              laws of Macedonia, without regard to its conflict of law
              provisions. Our failure to enforce any right or provision of these
              Terms will not be considered a waiver of those rights.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              10. Changes to Terms
            </h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. If a revision is material, we will
              provide at least 30 days&apos; notice prior to any new terms
              taking effect. What constitutes a material change will be
              determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              11. Contact Us
            </h2>
            <p className="mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="mb-1">
                <strong>Email:</strong> terms@tvojpazar.mk
              </p>
              <p>
                <strong>Address:</strong> Taftalidje, Skopje, Macedonia
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              className="bg-emerald-700 hover:bg-emerald-600 transition-colors"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
