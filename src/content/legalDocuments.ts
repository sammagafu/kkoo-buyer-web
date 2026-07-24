/**
 * KKOO legal documents — English source of truth for public policy pages.
 * Entity details from company-trust.ts.
 */
import { companyLegal } from '@/config/company-trust'

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string }

export type LegalSection = {
  title: string
  blocks: LegalBlock[]
}

export type LegalDocument = {
  slug: string
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

const ENTITY = companyLegal.legalEntity
const BRAND = companyLegal.brand
const PLACE = companyLegal.jurisdiction
const SUPPORT = companyLegal.supportEmail
const SAFETY = companyLegal.safetyEmail

export const legalDocuments = {
  terms: {
    slug: 'terms-of-use',
    title: 'Terms of Use',
    lastUpdated: '2026-07-24',
    intro: `These Terms of Use (“Terms”) govern your access to and use of ${BRAND} websites, mobile applications, and related services operated by ${ENTITY} (“${BRAND},” “we,” “us,” or “our”), including marketplace shopping, food and grocery ordering, rides, parcel and courier delivery, merchant tools, referrals, gift vouchers, and payments (together, the “Services”). By creating an account or using the Services, you agree to these Terms and our Privacy Policy, Cookie Policy, Refund Policy, Acceptable Use Policy, and Data Deletion instructions.`,
    sections: [
      {
        title: '1. Who we are',
        blocks: [
          {
            type: 'p',
            text: `${ENTITY} operates ${BRAND} from the ${PLACE}. We provide a technology platform that connects buyers, merchants (including shops, restaurants, and hotels), and independent riders or couriers. Unless we expressly say otherwise, we are not the seller of goods, the restaurant preparing food, or the transport carrier performing a ride or delivery.`,
          },
          {
            type: 'p',
            text: `Questions about these Terms: ${SUPPORT}. Safety or urgent incidents: ${SAFETY}.`,
          },
        ],
      },
      {
        title: '2. Eligibility and accounts',
        blocks: [
          {
            type: 'ul',
            items: [
              'You must be able to form a binding contract under applicable law. If you are under 18, you may use the Services only with a parent or guardian’s involvement where required.',
              'You must provide accurate registration details (including a valid phone number) and keep them up to date.',
              'You are responsible for safeguarding login credentials, OTP codes, and devices used to access your account.',
              'You may not share an account, create accounts for others without authority, or use another person’s account without permission.',
              'We may refuse, suspend, or close accounts to protect users, comply with law, or enforce these Terms.',
            ],
          },
        ],
      },
      {
        title: `3. The ${BRAND} platform role`,
        blocks: [
          {
            type: 'p',
            text: `${BRAND} is a marketplace and logistics-tech intermediary. Product descriptions, prices, stock, preparation times, and merchant offers are set by merchants unless labelled as a ${BRAND}-operated offer. Ride and delivery fulfilment is performed by riders or courier partners who accept jobs through the Services.`,
          },
          {
            type: 'p',
            text: `Escrow, tracking, ratings, disputes, and support tools help build trust between parties. They do not make us the manufacturer, retailer, insurer, or employer of every participant on the platform.`,
          },
        ],
      },
      {
        title: '4. Orders, prices, and payments',
        blocks: [
          {
            type: 'ul',
            items: [
              'Prices, fees, taxes, delivery charges, and promotions are shown at checkout before you confirm. Currency and local payment methods may vary by market.',
              'By placing an order or booking a ride/delivery, you authorise payment using your selected method (mobile money, card, wallet, or other available options).',
              'Where escrow or pay-on-delivery flows apply, release of funds follows the rules shown in the app and our Refund Policy.',
              'Promotions, vouchers, loyalty points, and referral rewards are subject to their own programme rules and may be changed or withdrawn.',
              'You are responsible for any customs duties, import fees, or third-party charges that apply to an order.',
            ],
          },
        ],
      },
      {
        title: '5. Delivery, rides, and timing',
        blocks: [
          {
            type: 'p',
            text: 'Estimated arrival, preparation, and delivery times are estimates only. Actual times depend on traffic, weather, merchant readiness, rider availability, and other factors outside our sole control. You must provide accurate pickup and drop-off details and be reachable at the stated location and phone number.',
          },
        ],
      },
      {
        title: '6. Cancellations, returns, and refunds',
        blocks: [
          {
            type: 'p',
            text: `Cancellation windows, return eligibility, and refunds are described in our Refund Policy. Food, grocery, and other perishable items often cannot be returned once prepared or delivered. Marketplace goods may have different rules depending on the merchant and product category.`,
          },
        ],
      },
      {
        title: '7. User content and licence',
        blocks: [
          {
            type: 'p',
            text: `You retain ownership of content you submit (reviews, photos, messages, listing copy, and similar). You grant ${BRAND} a worldwide, non-exclusive, royalty-free licence to host, use, reproduce, modify, publish, and display that content as needed to operate, promote, and improve the Services. You represent that you have the rights to grant this licence and that your content does not infringe others’ rights.`,
          },
        ],
      },
      {
        title: '8. Acceptable use',
        blocks: [
          {
            type: 'p',
            text: 'You must use the Services lawfully and in good faith. Prohibited conduct is set out in our Acceptable Use Policy, including fraud, illegal goods, harassment, spam, and attempts to circumvent security or payments.',
          },
        ],
      },
      {
        title: '9. Third-party services',
        blocks: [
          {
            type: 'p',
            text: 'The Services may link to or integrate payment processors, maps, messaging, identity providers (including Google sign-in where enabled), and other third parties. Their terms and privacy notices apply to their services. We are not responsible for third-party sites or services we do not control.',
          },
        ],
      },
      {
        title: '10. Disclaimers',
        blocks: [
          {
            type: 'p',
            text: `THE SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${BRAND} DISCLAIMS WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not guarantee uninterrupted or error-free operation, or that every listing, rider, or merchant will meet your expectations.`,
          },
        ],
      },
      {
        title: '11. Limitation of liability',
        blocks: [
          {
            type: 'p',
            text: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${ENTITY} AND ITS DIRECTORS, EMPLOYEES, AND AGENTS WILL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR LOST PROFITS, DATA, OR GOODWILL. OUR TOTAL LIABILITY FOR CLAIMS ARISING OUT OF THE SERVICES IN ANY TWELVE-MONTH PERIOD IS LIMITED TO THE GREATER OF (A) THE FEES YOU PAID TO ${BRAND} FOR THE SERVICE GIVING RISE TO THE CLAIM IN THAT PERIOD, OR (B) TWENTY THOUSAND TANZANIAN SHILLINGS (TZS 20,000), EXCEPT WHERE LIABILITY CANNOT BE LIMITED UNDER APPLICABLE LAW (INCLUDING FOR DEATH OR PERSONAL INJURY CAUSED BY NEGLIGENCE, OR FRAUD).`,
          },
        ],
      },
      {
        title: '12. Indemnity',
        blocks: [
          {
            type: 'p',
            text: `You agree to indemnify and hold harmless ${ENTITY} from claims, losses, and expenses (including reasonable legal fees) arising from your misuse of the Services, your content, your breach of these Terms, or your violation of law or third-party rights.`,
          },
        ],
      },
      {
        title: '13. Suspension and termination',
        blocks: [
          {
            type: 'p',
            text: 'You may stop using the Services at any time. You may request account deletion as described on our Data Deletion page. We may suspend or terminate access immediately if we believe you have breached these Terms, created risk or legal exposure, or if required by law or a payment partner.',
          },
        ],
      },
      {
        title: '14. Changes to the Services or Terms',
        blocks: [
          {
            type: 'p',
            text: `We may update features and these Terms from time to time. Material changes will be posted on this page with an updated “Last updated” date, and where appropriate we may notify you in-app or by SMS/email. Continued use after the effective date constitutes acceptance of the updated Terms.`,
          },
        ],
      },
      {
        title: '15. Governing law and disputes',
        blocks: [
          {
            type: 'p',
            text: `These Terms are governed by the laws of the ${PLACE}. Courts located in Dar es Salaam, Tanzania, have exclusive jurisdiction over disputes, without prejudice to any mandatory consumer protections that apply to you. Before filing a claim, please contact ${SUPPORT} so we can try to resolve the issue.`,
          },
        ],
      },
      {
        title: '16. Contact',
        blocks: [
          {
            type: 'p',
            text: `${ENTITY}\n${PLACE}\nSupport: ${SUPPORT}\nSafety: ${SAFETY}`,
          },
        ],
      },
    ],
  } satisfies LegalDocument,

  privacy: {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    lastUpdated: '2026-07-24',
    intro: `This Privacy Policy explains how ${ENTITY} (“${BRAND},” “we,” “us”) collects, uses, shares, and protects personal data when you use ${BRAND} websites, apps, and Services in the ${PLACE} and other markets where we operate. It should be read with our Cookie Policy and Data Deletion instructions.`,
    sections: [
      {
        title: '1. Data controller',
        blocks: [
          {
            type: 'p',
            text: `${ENTITY} is the controller of personal data processed through the Services. Contact: ${SUPPORT}.`,
          },
        ],
      },
      {
        title: '2. Information we collect',
        blocks: [
          {
            type: 'ul',
            items: [
              'Identity and contact data: name, phone number, email, profile photo, and government ID where required for verification, payouts, or compliance.',
              'Account and preference data: language, saved addresses, favourites, notification settings, and referral codes.',
              'Transaction data: orders, cart contents, receipts, refunds, disputes, vouchers, loyalty activity, and payment references (we do not store full card PAN where a processor tokenises payments).',
              'Location data: approximate or precise location when you enable it for delivery, rides, nearby discovery, or fraud prevention.',
              'Device and usage data: device type, OS, app version, IP address, diagnostics, crash logs, and interaction events.',
              'Communications: support chats, call metadata where applicable, in-app messages, and feedback.',
              'Partner data: information merchants or riders provide about fulfilment, and data from identity or payment providers you choose to connect.',
            ],
          },
        ],
      },
      {
        title: '3. How we use personal data',
        blocks: [
          {
            type: 'ul',
            items: [
              'Create and secure accounts, authenticate users (including OTP and optional Google sign-in), and prevent abuse.',
              'Process orders, rides, deliveries, payouts, refunds, and customer support.',
              'Show relevant catalogue, availability, and city-level services.',
              'Send service messages (order status, security alerts) and, where permitted, marketing you can opt out of.',
              'Improve product quality, safety, and performance through analytics and testing.',
              'Comply with legal obligations, respond to lawful requests, and protect rights, users, and the platform.',
            ],
          },
        ],
      },
      {
        title: '4. Legal bases',
        blocks: [
          {
            type: 'p',
            text: 'Depending on applicable law, we process data because: (a) it is necessary to perform a contract with you; (b) we have a legitimate interest in operating a safe, efficient marketplace; (c) you have consented (for example, optional cookies or marketing); or (d) we must comply with a legal obligation.',
          },
        ],
      },
      {
        title: '5. Sharing',
        blocks: [
          {
            type: 'p',
            text: 'We share personal data only as needed to run the Services:',
          },
          {
            type: 'ul',
            items: [
              'Merchants receive order and delivery details required to fulfil your purchase.',
              'Riders and couriers receive pickup/drop-off and contact details required to complete a job.',
              'Payment providers, SMS/OTP providers, cloud hosting, analytics, maps, and customer-support tools process data under contracts with us.',
              'Regulators, courts, or law enforcement when required by law or to protect safety and rights.',
              'Corporate successors in a merger, acquisition, or restructuring, subject to appropriate safeguards.',
            ],
          },
          {
            type: 'p',
            text: 'We do not sell your personal data.',
          },
        ],
      },
      {
        title: '6. International transfers',
        blocks: [
          {
            type: 'p',
            text: `Data may be processed on servers or by vendors outside the ${PLACE}. Where we transfer data internationally, we use appropriate contractual and organisational safeguards consistent with applicable law.`,
          },
        ],
      },
      {
        title: '7. Retention',
        blocks: [
          {
            type: 'p',
            text: 'We keep personal data only as long as needed for the purposes above, including account life, dispute windows, tax and accounting rules, fraud prevention, and legal holds. When no longer required, we delete or anonymise data. See our Data Deletion page for account closure requests.',
          },
        ],
      },
      {
        title: '8. Security',
        blocks: [
          {
            type: 'p',
            text: 'We use administrative, technical, and organisational measures designed to protect personal data (access controls, encryption in transit where appropriate, monitoring, and staff training). No method of transmission or storage is perfectly secure; please protect your devices and OTP codes.',
          },
        ],
      },
      {
        title: '9. Your rights',
        blocks: [
          {
            type: 'p',
            text: `Subject to applicable law, you may request access, correction, deletion, restriction, or a copy of your personal data, and object to certain processing. You may also withdraw consent where processing is consent-based. Contact ${SUPPORT}. We may need to verify your identity before fulfilling a request.`,
          },
        ],
      },
      {
        title: '10. Children',
        blocks: [
          {
            type: 'p',
            text: `The Services are not directed to children under 13 (or the higher age required in your jurisdiction). If you believe we have collected a child’s data inappropriately, contact ${SUPPORT} and we will take appropriate steps.`,
          },
        ],
      },
      {
        title: '11. Google user data',
        blocks: [
          {
            type: 'p',
            text: 'If you sign in with Google, we may receive basic profile information such as name, email address, and profile photo, limited to the OAuth scopes you approve on Google’s consent screen.',
          },
          {
            type: 'ul',
            items: [
              `Use: authenticate you, create or link your ${BRAND} account, and display account identity in the product.`,
              'We do not sell Google user data or use it for advertising profiling.',
              'Sharing: only with processors needed to operate the Services, or when required by law.',
              'Our use of information received from Google APIs complies with the Google API Services User Data Policy, including the Limited Use requirements.',
            ],
          },
        ],
      },
      {
        title: '12. Cookies and similar technologies',
        blocks: [
          {
            type: 'p',
            text: 'We use cookies and similar technologies as described in our Cookie Policy. You can manage optional cookies through our consent banner and browser settings.',
          },
        ],
      },
      {
        title: '13. Changes',
        blocks: [
          {
            type: 'p',
            text: 'We may update this Privacy Policy periodically. The “Last updated” date will change when we do. Material updates may also be communicated in-app or by email/SMS.',
          },
        ],
      },
      {
        title: '14. Contact',
        blocks: [
          {
            type: 'p',
            text: `Privacy requests: ${SUPPORT}\nSafety: ${SAFETY}\n${ENTITY}, ${PLACE}`,
          },
        ],
      },
    ],
  } satisfies LegalDocument,

  cookies: {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    lastUpdated: '2026-07-24',
    intro: `This Cookie Policy explains how ${ENTITY} (“${BRAND}”) uses cookies and similar technologies on ${BRAND} websites and web apps. It should be read with our Privacy Policy.`,
    sections: [
      {
        title: '1. What are cookies?',
        blocks: [
          {
            type: 'p',
            text: 'Cookies are small text files stored on your device. Similar technologies include local storage, session storage, pixels, and SDKs that store or read identifiers on your browser or device.',
          },
        ],
      },
      {
        title: '2. How we use cookies',
        blocks: [
          {
            type: 'ul',
            items: [
              'Essential: keep you signed in, secure forms, remember language, and operate checkout and consent preferences. These are required for the site to function.',
              'Functional: remember choices such as city, theme, or recently viewed items to improve convenience.',
              'Analytics: understand traffic, performance, and feature usage so we can improve the product (used only if you accept optional cookies where required).',
              'Marketing: measure campaigns and attribute referrals where you have consented.',
            ],
          },
        ],
      },
      {
        title: '3. Cookie consent',
        blocks: [
          {
            type: 'p',
            text: `On first visit we show a cookie banner. Essential cookies run by default. Optional analytics and marketing cookies run only after you accept, or as otherwise allowed by law. You can reject optional cookies and change your mind later by clearing site data or contacting ${SUPPORT}.`,
          },
        ],
      },
      {
        title: '4. Managing cookies',
        blocks: [
          {
            type: 'p',
            text: 'Most browsers let you block or delete cookies. If you block essential cookies, parts of the Services (sign-in, cart, checkout) may not work. Device-level advertising settings and platform consent tools may also apply on mobile apps.',
          },
        ],
      },
      {
        title: '5. Third parties',
        blocks: [
          {
            type: 'p',
            text: 'Some cookies are set by providers that help us with hosting, analytics, payments, maps, or communications. Those providers process data under their own policies and our contracts with them.',
          },
        ],
      },
      {
        title: '6. Updates',
        blocks: [
          {
            type: 'p',
            text: 'We may update this Cookie Policy when our practices or technologies change. Check the “Last updated” date on this page.',
          },
        ],
      },
      {
        title: '7. Contact',
        blocks: [
          {
            type: 'p',
            text: `Questions: ${SUPPORT}`,
          },
        ],
      },
    ],
  } satisfies LegalDocument,

  refunds: {
    slug: 'refund-policy',
    title: 'Refund Policy',
    lastUpdated: '2026-07-24',
    intro: `This Refund Policy explains when and how ${ENTITY} (“${BRAND}”) handles cancellations, returns, and refunds across marketplace, food, grocery, rides, and delivery. Specific options shown in the app for an order always control if they are more specific than this page.`,
    sections: [
      {
        title: '1. General principles',
        blocks: [
          {
            type: 'ul',
            items: [
              'Act quickly: report issues from the order or trip screen as soon as you notice a problem.',
              'Provide clear evidence when requested (photos, videos, order number, description of the issue).',
              `Refunds, where approved, are returned to the original payment method or ${BRAND} wallet, depending on how you paid and what the processor supports.`,
              `Merchant-fulfilled goods remain the merchant’s responsibility for quality and legality; ${BRAND} helps coordinate disputes fairly.`,
            ],
          },
        ],
      },
      {
        title: '2. Marketplace goods',
        blocks: [
          {
            type: 'p',
            text: 'You may be eligible for a refund, replacement, or store credit when an item is not delivered, is materially different from the listing, arrives damaged, or is missing parts essential to use—subject to merchant return windows and product type.',
          },
          {
            type: 'ul',
            items: [
              'Perishable, personalised, hygiene-sealed, or clearance items may be non-returnable once dispatched.',
              'Change-of-mind returns are not guaranteed and depend on the merchant’s stated policy.',
              'You may be asked to return an item in original condition before a refund is released.',
            ],
          },
        ],
      },
      {
        title: '3. Food, grocery, and restaurants',
        blocks: [
          {
            type: 'p',
            text: 'Because food and groceries are perishable, refunds typically apply to wrong items, missing items, unsafe or spoiled goods on arrival, or cancelled orders before preparation/dispatch—not to taste preference alone. Report issues promptly with photos when possible.',
          },
        ],
      },
      {
        title: '4. Rides and courier delivery',
        blocks: [
          {
            type: 'ul',
            items: [
              'Fare adjustments may apply for cancellations, no-shows, route changes, waiting time, or app-reported incidents.',
              'If a trip or delivery fails due to rider or platform error, contact support for a review.',
              'Lost or damaged parcels should be reported immediately with proof of contents and packaging where available.',
            ],
          },
        ],
      },
      {
        title: '5. Vouchers, promotions, and wallet',
        blocks: [
          {
            type: 'p',
            text: 'Promotional credit, referral bonuses, and gift vouchers follow their programme terms. Unused promotional value may expire. Cash refunds of promotional credit are generally not available.',
          },
        ],
      },
      {
        title: '6. How to request a refund',
        blocks: [
          {
            type: 'ol',
            items: [
              `Open the relevant order or trip in the ${BRAND} app or web account.`,
              'Choose help / dispute / report a problem and submit details and evidence.',
              'Our team reviews the case, which may include contacting the merchant or rider.',
              'You receive a decision in-app or by SMS/email. Approved refunds are initiated according to payment-rail timelines (mobile money and cards can take several business days).',
            ],
          },
        ],
      },
      {
        title: '7. Chargebacks and payment disputes',
        blocks: [
          {
            type: 'p',
            text: `Please contact ${BRAND} support before filing a chargeback with your bank or mobile-money provider. Chargebacks filed without contacting us may delay resolution and can lead to account restrictions if abuse is detected.`,
          },
        ],
      },
      {
        title: '8. Contact',
        blocks: [
          {
            type: 'p',
            text: `Refunds and disputes: ${SUPPORT}`,
          },
        ],
      },
    ],
  } satisfies LegalDocument,

  acceptableUse: {
    slug: 'acceptable-use',
    title: 'Acceptable Use Policy',
    lastUpdated: '2026-07-24',
    intro: `This Acceptable Use Policy (“AUP”) sets rules for using ${BRAND} Services operated by ${ENTITY}. It applies to buyers, merchants, riders, staff users, and API partners. Violations may result in content removal, job bans, account suspension, or legal action.`,
    sections: [
      {
        title: '1. Lawful use only',
        blocks: [
          {
            type: 'p',
            text: `You must comply with the laws of the ${PLACE} and any other applicable law. You may not use ${BRAND} to solicit, facilitate, or conceal illegal activity.`,
          },
        ],
      },
      {
        title: '2. Prohibited activities',
        blocks: [
          {
            type: 'ul',
            items: [
              'Fraud, identity theft, phishing, fake orders, payment manipulation, or chargeback abuse.',
              'Listing or selling illegal, stolen, counterfeit, or heavily restricted goods/services (including illicit drugs, weapons where prohibited, and unlicensed pharmaceuticals).',
              'Harassment, hate speech, threats, exploitation of minors, or non-consensual intimate imagery.',
              'Spam, scraping at abusive scale, reverse engineering, or attacking our infrastructure.',
              'Circumventing fees, ratings, verification, geo-limits, or security controls.',
              `Impersonating ${BRAND}, merchants, riders, or other users.`,
              'Using the platform while intoxicated or unfit when acting as a rider or courier.',
              'Discriminating against users in a manner prohibited by law.',
            ],
          },
        ],
      },
      {
        title: '3. Merchant and listing standards',
        blocks: [
          {
            type: 'ul',
            items: [
              'Listings must be accurate, clearly described, and honestly priced.',
              'Required licences and permits for regulated categories remain your responsibility.',
              'Do not upload content you do not have rights to use.',
              'Honour confirmed orders within stated preparation and stock commitments.',
            ],
          },
        ],
      },
      {
        title: '4. Safety',
        blocks: [
          {
            type: 'p',
            text: `Report safety incidents immediately in-app or to ${SAFETY}. Do not confront others in ways that escalate risk; contact local authorities when someone is in immediate danger.`,
          },
        ],
      },
      {
        title: '5. Enforcement',
        blocks: [
          {
            type: 'p',
            text: `${BRAND} may investigate suspected violations, remove content, withhold payouts pending review, suspend features, or terminate accounts. We may preserve and share information with law enforcement when legally required or necessary to protect users.`,
          },
        ],
      },
      {
        title: '6. Reporting',
        blocks: [
          {
            type: 'p',
            text: `Report misuse through in-app reporting tools or email ${SUPPORT}. Include order/trip IDs, screenshots, and a clear description.`,
          },
        ],
      },
      {
        title: '7. Contact',
        blocks: [
          {
            type: 'p',
            text: `AUP questions: ${SUPPORT}\nSafety: ${SAFETY}`,
          },
        ],
      },
    ],
  } satisfies LegalDocument,

  dataDeletion: {
    slug: 'data-deletion',
    title: 'Data deletion',
    lastUpdated: '2026-07-24',
    intro: `${BRAND} respects your right to request deletion of personal data associated with your account. This page explains how buyers, merchants, riders, and other users can ask ${ENTITY} to delete data we hold.`,
    sections: [
      {
        title: '1. How to request deletion',
        blocks: [
          {
            type: 'p',
            text: 'You can request deletion of your KKOO account and associated personal data using either method:',
          },
          {
            type: 'ul',
            items: [
              `In the ${BRAND} buyer, business, or rider app: open Account / Profile → Settings → contact support and request account deletion (include the phone number on your account).`,
              `Email ${SUPPORT} with subject “KKOO account data deletion request”.`,
            ],
          },
          {
            type: 'note',
            text: 'Include your registered phone number in E.164 format (for example +255…) and your full name. We may verify ownership before processing.',
          },
        ],
      },
      {
        title: '2. What we delete',
        blocks: [
          {
            type: 'p',
            text: 'After verification, we delete or anonymise personal data linked to your account where we are not required to keep it, including profile details, saved addresses, cart contents, notification preferences, and active sessions.',
          },
        ],
      },
      {
        title: '3. What we may retain',
        blocks: [
          {
            type: 'p',
            text: 'We may retain certain records after account deletion when required by law or legitimate business needs—for example completed transaction history, invoices, payout records, dispute evidence, and security logs. Retained data is limited to what is necessary and protected under our Privacy Policy.',
          },
        ],
      },
      {
        title: '4. Processing time',
        blocks: [
          {
            type: 'p',
            text: 'We aim to complete verified deletion requests within 30 days. You will receive confirmation by email or SMS when deletion is finished. Some backups may take additional time to cycle out of our systems.',
          },
        ],
      },
      {
        title: '5. Meta / Facebook connected accounts',
        blocks: [
          {
            type: 'p',
            text: `If you interacted with ${BRAND} through a Meta product (for example WhatsApp OTP), you may also remove ${BRAND} from your Facebook Apps and Websites settings. A deletion request to ${BRAND} deletes data we hold tied to your phone account; it does not automatically remove data stored by Meta on Meta’s systems.`,
          },
        ],
      },
      {
        title: '6. Contact',
        blocks: [
          {
            type: 'p',
            text: `Privacy and deletion requests: ${SUPPORT}`,
          },
        ],
      },
    ],
  } satisfies LegalDocument,
} as const

export type LegalDocKey = keyof typeof legalDocuments
