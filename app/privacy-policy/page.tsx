"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-gradient-to-b from-[#023020] to-[#034530] py-16">
        <div className="container mx-auto px-4">
          <Link href="/" className="inline-flex items-center text-white mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
            Privacy Policy
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
              Welcome to TvojPazar. We respect your privacy and are committed to
              protecting your personal data. This privacy policy will inform you
              about how we look after your personal data when you visit our
              website and tell you about your privacy rights and how the law
              protects you.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              2. The Data We Collect About You
            </h2>
            <p className="mb-4">
              Personal data, or personal information, means any information
              about an individual from which that person can be identified. We
              may collect, use, store and transfer different kinds of personal
              data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                <strong>Identity Data</strong> includes first name, last name,
                username or similar identifier.
              </li>
              <li className="mb-2">
                <strong>Contact Data</strong> includes email address, telephone
                numbers, and address.
              </li>
              <li className="mb-2">
                <strong>Technical Data</strong> includes internet protocol (IP)
                address, your login data, browser type and version, time zone
                setting and location, browser plug-in types and versions,
                operating system and platform, and other technology on the
                devices you use to access this website.
              </li>
              <li className="mb-2">
                <strong>Profile Data</strong> includes your username and
                password, purchases or orders made by you, your interests,
                preferences, feedback, and survey responses.
              </li>
              <li className="mb-2">
                <strong>Usage Data</strong> includes information about how you
                use our website, products, and services.
              </li>
              <li className="mb-2">
                <strong>Marketing and Communications Data</strong> includes your
                preferences in receiving marketing from us and our third parties
                and your communication preferences.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              3. How We Use Your Personal Data
            </h2>
            <p className="mb-4">
              We will only use your personal data when the law allows us to.
              Most commonly, we will use your personal data in the following
              circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">
                Where we need to perform the contract we are about to enter into
                or have entered into with you.
              </li>
              <li className="mb-2">
                Where it is necessary for our legitimate interests (or those of
                a third party) and your interests and fundamental rights do not
                override those interests.
              </li>
              <li className="mb-2">
                Where we need to comply with a legal obligation.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              4. Data Security
            </h2>
            <p className="mb-6">
              We have put in place appropriate security measures to prevent your
              personal data from being accidentally lost, used, or accessed in
              an unauthorized way, altered, or disclosed. In addition, we limit
              access to your personal data to those employees, agents,
              contractors, and other third parties who have a business need to
              know. They will only process your personal data on our
              instructions, and they are subject to a duty of confidentiality.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              5. Data Retention
            </h2>
            <p className="mb-6">
              We will only retain your personal data for as long as reasonably
              necessary to fulfill the purposes we collected it for, including
              for the purposes of satisfying any legal, regulatory, tax,
              accounting, or reporting requirements. We may retain your personal
              data for a longer period in the event of a complaint or if we
              reasonably believe there is a prospect of litigation in respect to
              our relationship with you.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              6. Your Legal Rights
            </h2>
            <p className="mb-4">
              Under certain circumstances, you have rights under data protection
              laws in relation to your personal data, including the right to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li className="mb-2">Request access to your personal data.</li>
              <li className="mb-2">
                Request correction of your personal data.
              </li>
              <li className="mb-2">Request erasure of your personal data.</li>
              <li className="mb-2">
                Object to processing of your personal data.
              </li>
              <li className="mb-2">
                Request restriction of processing your personal data.
              </li>
              <li className="mb-2">Request transfer of your personal data.</li>
              <li className="mb-2">Right to withdraw consent.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              7. Cookies
            </h2>
            <p className="mb-6">
              You can set your browser to refuse all or some browser cookies, or
              to alert you when websites set or access cookies. If you disable
              or refuse cookies, please note that some parts of this website may
              become inaccessible or not function properly.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              8. Changes to the Privacy Policy
            </h2>
            <p className="mb-6">
              We may update our privacy policy from time to time. We will notify
              you of any changes by posting the new privacy policy on this page
              and updating the &quot;Last updated&quot; date at the top of this
              privacy policy.
            </p>

            <h2 className="text-2xl font-semibold text-[#023020] mb-4">
              9. Contact Us
            </h2>
            <p className="mb-6">
              If you have any questions about this privacy policy or our privacy
              practices, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="mb-1">
                <strong>Email:</strong> privacy@tvojpazar.mk
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
