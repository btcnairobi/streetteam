import { Step, Merchant, TeamMember } from './types';

export const STRATEGY_STEPS: Step[] = [
  {
    id: 1,
    title: "Recruit 3–5 Youth",
    description: "Build your core street team per constituency.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "1-1", text: "Post a recruitment call on constituency WhatsApp groups." },
          { id: "1-2", text: "Share a Google Form link for youth to fill in their interest." },
          { id: "1-3", text: "Send automated WhatsApp confirmation to applicants." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "1-4", text: "Visit youth centres and announce the opportunity physically." },
          { id: "1-5", text: "Meet interested youth in person and verify commitment." },
          { id: "1-6", text: "Collect physical sign-ups and contacts." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "1-7", text: "Add selected youth to a private WhatsApp onboarding group." },
          { id: "1-8", text: "Share training schedule and meeting point digitally." },
          { id: "1-9", text: "Call each youth personally to reconfirm availability." }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Teach 2-Minute Script",
    description: "Ensure the team knows exactly what to say.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "2-1", text: "Share the script PDF or Google Doc." },
          { id: "2-2", text: "Post a short video demonstrating the script delivery." },
          { id: "2-3", text: "Send voice notes explaining key talking points." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "2-4", text: "Meet physically for script practice." },
          { id: "2-5", text: "Pair team members to role-play merchant conversations." },
          { id: "2-6", text: "Give printed scripts for pocket reference." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "2-7", text: "Test each member individually via recorded voice notes." },
          { id: "2-8", text: "Share corrections or improvements on WhatsApp." },
          { id: "2-9", text: "Assign each member a mini-quiz to confirm script mastery." }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Walk Door-to-Door",
    description: "Begin the physical outreach campaign.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "3-1", text: "Identify target streets using Google Maps." },
          { id: "3-2", text: "Share the walking route in WhatsApp group." },
          { id: "3-3", text: "Send motivation and briefing notes before deployment." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "3-4", text: "Walk door-to-door and greet merchants respectfully." },
          { id: "3-5", text: "Use name tags or branded wear for trust." },
          { id: "3-6", text: "Offer a printed introduction card." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "3-7", text: "Send merchant names and locations to the online sheet." },
          { id: "3-8", text: "Share photos (with permission) into the team group." },
          { id: "3-9", text: "Update daily progress in a shared dashboard." }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Explain Mission",
    description: "Pitch the value proposition to the merchant.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "4-1", text: "Open the merchant info sheet on your phone." },
          { id: "4-2", text: "Show a simple online infographic about Bitcoin." },
          { id: "4-3", text: "Play a 20–30 sec introductory video." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "4-4", text: "Explain your identity and the campaign goal." },
          { id: "4-5", text: "Ask merchant about their current payment challenges." },
          { id: "4-6", text: "Clarify doubts and address fears face-to-face." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "4-7", text: "Send the merchant a short “What is Bitcoin?” article." },
          { id: "4-8", text: "Share a WhatsApp contact for future questions." },
          { id: "4-9", text: "Add them to a merchant support broadcast list." }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Show Wallet & Tx",
    description: "Provide social proof through demonstration.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "5-1", text: "Open your Lightning wallet and show recent online receipts." },
          { id: "5-2", text: "Display online transaction timestamps for credibility." },
          { id: "5-3", text: "Show a QR invoice on your own screen." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "5-4", text: "Explain how the wallet works physically." },
          { id: "5-5", text: "Compare speed vs M-Pesa in real time." },
          { id: "5-6", text: "Demonstrate how to generate an invoice." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "5-7", text: "Send screenshots of previous real transactions." },
          { id: "5-8", text: "Provide a mini video guide on wallet usage." },
          { id: "5-9", text: "Invite merchant to online wallet training later." }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Demo Payment",
    description: "Get the merchant their first Satoshis.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "6-1", text: "Help merchant download wallet from Play Store." },
          { id: "6-2", text: "Share the wallet setup guide link." },
          { id: "6-3", text: "Watch them create their first invoice." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "6-4", text: "Scan their invoice physically." },
          { id: "6-5", text: "Send 10–20 sats instantly." },
          { id: "6-6", text: "Show them how the balance updates." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "6-7", text: "Send a written guide for creating future invoices." },
          { id: "6-8", text: "Add them to a merchant payment WhatsApp channel." },
          { id: "6-9", text: "Schedule a follow-up testing payment." }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Stickers & QR",
    description: "Physical branding and payment infrastructure.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "7-1", text: "Show merchant a digital version of the sticker." },
          { id: "7-2", text: "Share a link to the printable QR card." },
          { id: "7-3", text: "Register merchant in your online map/list." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "7-4", text: "Place sticker on their counter/window." },
          { id: "7-5", text: "Position the QR card next to payment area." },
          { id: "7-6", text: "Explain how customers scan and pay." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "7-7", text: "Send them a backup QR via WhatsApp." },
          { id: "7-8", text: "Confirm sticker visibility with a photo." },
          { id: "7-9", text: "Update the merchant directory record." }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Record Data",
    description: "Database entry and CRM management.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "8-1", text: "Enter merchant details in Google Sheets/App." },
          { id: "8-2", text: "Upload verification photo." },
          { id: "8-3", text: "Mark status as “Onboarded.”" }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "8-4", text: "Verify number and spelling inside the shop." },
          { id: "8-5", text: "Record exact shop location manually." },
          { id: "8-6", text: "Confirm they received demo payment." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "8-7", text: "Add merchant to CRM/Telegram/WhatsApp list." },
          { id: "8-8", text: "Send a welcome message." },
          { id: "8-9", text: "Tag them as “Needs follow-up”." }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Return Support",
    description: "Ensuring long-term adoption and retention.",
    phases: [
      {
        title: "Start (Online)",
        type: 'online',
        procedures: [
          { id: "9-1", text: "Text merchant asking for a quick check-in." },
          { id: "9-2", text: "Share tips on how to attract Bitcoin users." },
          { id: "9-3", text: "Send link to short educational content." }
        ]
      },
      {
        title: "Ground (Offline)",
        type: 'ground',
        procedures: [
          { id: "9-4", text: "Visit the shop in person." },
          { id: "9-5", text: "Ask if they tried any transactions." },
          { id: "9-6", text: "Perform a second demo payment." }
        ]
      },
      {
        title: "Follow-up",
        type: 'followup',
        procedures: [
          { id: "9-7", text: "Add them to weekly merchant newsletter." },
          { id: "9-8", text: "Share upcoming training dates." },
          { id: "9-9", text: "Encourage them to onboard another merchant nearby." }
        ]
      }
    ]
  }
];

export const MOCK_MERCHANTS: Merchant[] = [
  { id: '1', name: 'Mama Njoroge Kiosk', address: 'Market St, 14', status: 'Onboarded', notes: 'Very interested, installed wallet.', dateAdded: '2023-10-24' },
  { id: '2', name: 'Cyber Cafe Max', address: 'High Road, 22', status: 'New', notes: 'Skeptical, needs follow up demo.', dateAdded: '2023-10-25' },
];

export const MOCK_TEAM: TeamMember[] = [
  { id: '1', name: 'Kevin O.', status: 'Active', phone: '+254 700 000000' },
  { id: '2', name: 'Sarah W.', status: 'Training', phone: '+254 711 111111' },
];