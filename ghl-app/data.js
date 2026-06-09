// LeadFlow CRM - Mock Data
const AppData = {
  contacts: [
    { id: 1, name: "James Mitchell", email: "james.mitchell@techcorp.com", phone: "+1 (555) 234-5678", company: "TechCorp Inc.", tags: ["Hot Lead", "Enterprise"], status: "active", value: 15000, stage: "Proposal", dateAdded: "2024-01-15", lastActivity: "2024-03-10", notes: "Interested in enterprise plan. Follow up Friday.", avatar: "JM" },
    { id: 2, name: "Sarah Thompson", email: "s.thompson@marketpro.io", phone: "+1 (555) 345-6789", company: "MarketPro", tags: ["Warm Lead", "SMB"], status: "active", value: 4500, stage: "Contacted", dateAdded: "2024-01-22", lastActivity: "2024-03-12", notes: "Looking for email automation.", avatar: "ST" },
    { id: 3, name: "David Chen", email: "dchen@globalventures.com", phone: "+1 (555) 456-7890", company: "Global Ventures", tags: ["Enterprise", "Priority"], status: "active", value: 32000, stage: "Won", dateAdded: "2024-01-08", lastActivity: "2024-03-14", notes: "Closed deal. Onboarding next week.", avatar: "DC" },
    { id: 4, name: "Emily Rodriguez", email: "emily.r@startuplab.co", phone: "+1 (555) 567-8901", company: "StartupLab", tags: ["Cold Lead"], status: "inactive", value: 1200, stage: "New Lead", dateAdded: "2024-02-01", lastActivity: "2024-03-01", notes: "Initial contact made via LinkedIn.", avatar: "ER" },
    { id: 5, name: "Michael Brown", email: "m.brown@retailchain.com", phone: "+1 (555) 678-9012", company: "RetailChain", tags: ["Warm Lead", "Retail"], status: "active", value: 8700, stage: "Proposal", dateAdded: "2024-02-05", lastActivity: "2024-03-13", notes: "Needs custom pricing for 50 locations.", avatar: "MB" },
    { id: 6, name: "Lisa Park", email: "lisa.park@creativestudio.net", phone: "+1 (555) 789-0123", company: "Creative Studio", tags: ["SMB", "Creative"], status: "active", value: 2900, stage: "Contacted", dateAdded: "2024-02-10", lastActivity: "2024-03-11", notes: "Demo scheduled for next Tuesday.", avatar: "LP" },
    { id: 7, name: "Robert Williams", email: "rwilliams@financeplus.com", phone: "+1 (555) 890-1234", company: "FinancePlus", tags: ["Enterprise", "Finance"], status: "active", value: 45000, stage: "Proposal", dateAdded: "2024-01-30", lastActivity: "2024-03-15", notes: "Requesting compliance documentation.", avatar: "RW" },
    { id: 8, name: "Jennifer Lee", email: "jlee@healthsolutions.org", phone: "+1 (555) 901-2345", company: "Health Solutions", tags: ["Healthcare", "Priority"], status: "active", value: 12000, stage: "Won", dateAdded: "2024-02-14", lastActivity: "2024-03-14", notes: "HIPAA requirements addressed.", avatar: "JL" },
    { id: 9, name: "Kevin Martinez", email: "kevin.m@ecomshop.store", phone: "+1 (555) 012-3456", company: "EcomShop", tags: ["Ecommerce", "SMB"], status: "active", value: 5600, stage: "Contacted", dateAdded: "2024-02-20", lastActivity: "2024-03-09", notes: "Interested in automation for cart abandonment.", avatar: "KM" },
    { id: 10, name: "Amanda Foster", email: "a.foster@legalgroup.law", phone: "+1 (555) 123-4567", company: "Legal Group LLP", tags: ["Legal", "Enterprise"], status: "inactive", value: 22000, stage: "Lost", dateAdded: "2024-01-18", lastActivity: "2024-02-28", notes: "Budget constraints cited. Revisit Q3.", avatar: "AF" },
    { id: 11, name: "Thomas Anderson", email: "t.anderson@techsolutions.dev", phone: "+1 (555) 234-5670", company: "Tech Solutions Dev", tags: ["Hot Lead", "SaaS"], status: "active", value: 18500, stage: "Proposal", dateAdded: "2024-02-25", lastActivity: "2024-03-15", notes: "CTO review pending.", avatar: "TA" },
    { id: 12, name: "Nicole Scott", email: "nscott@realtypros.com", phone: "+1 (555) 345-6780", company: "Realty Pros", tags: ["Real Estate", "Warm Lead"], status: "active", value: 7800, stage: "Contacted", dateAdded: "2024-03-01", lastActivity: "2024-03-13", notes: "Expanding to 3 new markets.", avatar: "NS" },
    { id: 13, name: "Christopher King", email: "cking@manufacturing.co", phone: "+1 (555) 456-7891", company: "King Manufacturing", tags: ["Enterprise", "Industrial"], status: "active", value: 55000, stage: "Proposal", dateAdded: "2024-02-08", lastActivity: "2024-03-12", notes: "Large procurement cycle. Patience required.", avatar: "CK" },
    { id: 14, name: "Stephanie Moore", email: "s.moore@fashionbrand.com", phone: "+1 (555) 567-8902", company: "FashionBrand Co.", tags: ["Retail", "SMB"], status: "active", value: 3400, stage: "New Lead", dateAdded: "2024-03-05", lastActivity: "2024-03-05", notes: "Discovered us via Instagram ad.", avatar: "SM" },
    { id: 15, name: "Daniel White", email: "dwhite@consultingfirm.biz", phone: "+1 (555) 678-9013", company: "Consulting Firm", tags: ["Consulting", "Warm Lead"], status: "active", value: 9200, stage: "Contacted", dateAdded: "2024-02-28", lastActivity: "2024-03-14", notes: "Referred by Robert Williams.", avatar: "DW" },
    { id: 16, name: "Rachel Green", email: "r.green@nonprofit.org", phone: "+1 (555) 789-0124", company: "NonProfit United", tags: ["Nonprofit", "Cold Lead"], status: "inactive", value: 800, stage: "New Lead", dateAdded: "2024-03-02", lastActivity: "2024-03-02", notes: "Limited budget. Checking grant options.", avatar: "RG" },
    { id: 17, name: "Andrew Harris", email: "a.harris@logistics.net", phone: "+1 (555) 890-1235", company: "Swift Logistics", tags: ["Logistics", "Enterprise"], status: "active", value: 28000, stage: "Won", dateAdded: "2024-01-25", lastActivity: "2024-03-10", notes: "Successfully onboarded. Monthly check-in.", avatar: "AH" },
    { id: 18, name: "Megan Clark", email: "mclark@educationtech.edu", phone: "+1 (555) 901-2346", company: "EduTech Solutions", tags: ["Education", "SMB"], status: "active", value: 6100, stage: "Contacted", dateAdded: "2024-03-03", lastActivity: "2024-03-11", notes: "K-12 district interested in parent engagement tools.", avatar: "MC" },
    { id: 19, name: "Jason Turner", email: "j.turner@autogroup.cars", phone: "+1 (555) 012-3457", company: "Turner Auto Group", tags: ["Automotive", "Hot Lead"], status: "active", value: 14200, stage: "Proposal", dateAdded: "2024-02-22", lastActivity: "2024-03-15", notes: "10 dealership locations. High priority.", avatar: "JT" },
    { id: 20, name: "Patricia Lewis", email: "p.lewis@insurance.com", phone: "+1 (555) 123-4568", company: "Lewis Insurance", tags: ["Insurance", "Enterprise"], status: "active", value: 19500, stage: "Contacted", dateAdded: "2024-02-18", lastActivity: "2024-03-13", notes: "Compliance team reviewing contract.", avatar: "PL" },
    { id: 21, name: "Brandon Hall", email: "b.hall@sportsclub.fit", phone: "+1 (555) 234-5671", company: "Peak Sports Club", tags: ["Fitness", "SMB"], status: "active", value: 2600, stage: "New Lead", dateAdded: "2024-03-08", lastActivity: "2024-03-08", notes: "Wants member retention campaigns.", avatar: "BH" },
    { id: 22, name: "Christine Young", email: "cyoung@restaurant.group", phone: "+1 (555) 345-6781", company: "Young Restaurant Group", tags: ["Restaurant", "Warm Lead"], status: "active", value: 4100, stage: "Contacted", dateAdded: "2024-03-06", lastActivity: "2024-03-12", notes: "10 restaurant locations. SMS marketing focus.", avatar: "CY" },
    { id: 23, name: "Ryan Baker", email: "r.baker@cybersec.tech", phone: "+1 (555) 456-7892", company: "CyberSec Tech", tags: ["Technology", "Hot Lead"], status: "active", value: 38000, stage: "Proposal", dateAdded: "2024-02-12", lastActivity: "2024-03-14", notes: "CISO involvement. Advanced security needs.", avatar: "RB" },
    { id: 24, name: "Angela Davis", email: "adavis@pharma.health", phone: "+1 (555) 567-8903", company: "PharmaCo Health", tags: ["Healthcare", "Enterprise"], status: "active", value: 65000, stage: "Won", dateAdded: "2024-01-20", lastActivity: "2024-03-15", notes: "Largest deal this quarter. Celebrate!", avatar: "AD" },
    { id: 25, name: "Mark Wilson", email: "m.wilson@realestate.pro", phone: "+1 (555) 678-9014", company: "Wilson Real Estate", tags: ["Real Estate", "Cold Lead"], status: "inactive", value: 3700, stage: "New Lead", dateAdded: "2024-03-09", lastActivity: "2024-03-09", notes: "Webinar attendee. Needs nurturing.", avatar: "MW" }
  ],

  opportunities: [
    { id: 1, title: "TechCorp Enterprise Package", contact: "James Mitchell", company: "TechCorp Inc.", value: 15000, stage: "Proposal", probability: 65, daysInStage: 8, closeDate: "2024-04-15", notes: "Enterprise plan discussion" },
    { id: 2, title: "MarketPro Email Automation", contact: "Sarah Thompson", company: "MarketPro", value: 4500, stage: "Contacted", probability: 30, daysInStage: 5, closeDate: "2024-04-30", notes: "Email workflow setup" },
    { id: 3, title: "Global Ventures Full Suite", contact: "David Chen", company: "Global Ventures", value: 32000, stage: "Won", probability: 100, daysInStage: 2, closeDate: "2024-03-14", notes: "Closed! Onboarding in progress" },
    { id: 4, title: "RetailChain Multi-Location", contact: "Michael Brown", company: "RetailChain", value: 8700, stage: "Proposal", probability: 55, daysInStage: 12, closeDate: "2024-04-20", notes: "Custom pricing required" },
    { id: 5, title: "FinancePlus Compliance CRM", contact: "Robert Williams", company: "FinancePlus", value: 45000, stage: "Proposal", probability: 70, daysInStage: 3, closeDate: "2024-04-10", notes: "Legal review underway" },
    { id: 6, title: "Health Solutions HIPAA Setup", contact: "Jennifer Lee", company: "Health Solutions", value: 12000, stage: "Won", probability: 100, daysInStage: 1, closeDate: "2024-03-14", notes: "Deal closed" },
    { id: 7, title: "StartupLab Starter Package", contact: "Emily Rodriguez", company: "StartupLab", value: 1200, stage: "New Lead", probability: 15, daysInStage: 2, closeDate: "2024-05-15", notes: "First contact" },
    { id: 8, title: "Tech Solutions Dev SaaS", contact: "Thomas Anderson", company: "Tech Solutions Dev", value: 18500, stage: "Proposal", probability: 60, daysInStage: 7, closeDate: "2024-04-25", notes: "Technical evaluation ongoing" },
    { id: 9, title: "King Manufacturing CRM", contact: "Christopher King", company: "King Manufacturing", value: 55000, stage: "Proposal", probability: 45, daysInStage: 15, closeDate: "2024-05-01", notes: "Long procurement cycle" },
    { id: 10, title: "EcomShop Automation Bundle", contact: "Kevin Martinez", company: "EcomShop", value: 5600, stage: "Contacted", probability: 35, daysInStage: 4, closeDate: "2024-04-18", notes: "Demo completed" },
    { id: 11, title: "PharmaCo Enterprise Deal", contact: "Angela Davis", company: "PharmaCo Health", value: 65000, stage: "Won", probability: 100, daysInStage: 0, closeDate: "2024-03-15", notes: "Q1 hero deal" },
    { id: 12, title: "Turner Auto Group Rollout", contact: "Jason Turner", company: "Turner Auto Group", value: 14200, stage: "Proposal", probability: 72, daysInStage: 5, closeDate: "2024-04-05", notes: "All 10 locations" },
    { id: 13, title: "Swift Logistics Annual", contact: "Andrew Harris", company: "Swift Logistics", value: 28000, stage: "Won", probability: 100, daysInStage: 3, closeDate: "2024-01-25", notes: "Renewed last quarter" },
    { id: 14, title: "Legal Group LLP Contract", contact: "Amanda Foster", company: "Legal Group LLP", value: 22000, stage: "Lost", probability: 0, daysInStage: 20, closeDate: "2024-02-28", notes: "Budget freeze" },
    { id: 15, title: "CyberSec Advanced CRM", contact: "Ryan Baker", company: "CyberSec Tech", value: 38000, stage: "Proposal", probability: 68, daysInStage: 6, closeDate: "2024-04-12", notes: "Security audit required" }
  ],

  campaigns: [
    { id: 1, name: "Q1 Welcome Series", type: "Email", status: "active", sent: 4820, opened: 2168, clicked: 651, converted: 98, revenue: 24500, createdAt: "2024-01-02", subject: "Welcome to LeadFlow - Let's Get Started!", audience: "New Leads", unsubscribed: 42 },
    { id: 2, name: "Product Demo Follow-Up", type: "Email", status: "active", sent: 1350, opened: 783, clicked: 312, converted: 67, revenue: 18900, createdAt: "2024-01-15", subject: "How did your demo go? Next steps inside", audience: "Demo Attended", unsubscribed: 18 },
    { id: 3, name: "Re-engagement Blitz", type: "SMS", status: "active", sent: 2200, opened: 1870, clicked: 445, converted: 89, revenue: 12300, createdAt: "2024-02-01", subject: "We miss you! Exclusive offer inside", audience: "Inactive 60d", unsubscribed: 31 },
    { id: 4, name: "Enterprise Outreach", type: "Email", status: "active", sent: 890, opened: 534, clicked: 178, converted: 45, revenue: 87500, createdAt: "2024-02-10", subject: "How [Company] can scale with LeadFlow", audience: "Enterprise Prospects", unsubscribed: 12 },
    { id: 5, name: "Spring Promo Blast", type: "SMS", status: "draft", sent: 0, opened: 0, clicked: 0, converted: 0, revenue: 0, createdAt: "2024-03-10", subject: "Spring into savings - 30% off today only!", audience: "All Contacts", unsubscribed: 0 },
    { id: 6, name: "Webinar Invite Series", type: "Email", status: "completed", sent: 3400, opened: 1530, clicked: 612, converted: 156, revenue: 31200, createdAt: "2024-01-20", subject: "Join our FREE CRM Mastery Webinar", audience: "Warm Leads", unsubscribed: 56 },
    { id: 7, name: "Renewal Reminder", type: "Email", status: "active", sent: 560, opened: 448, clicked: 224, converted: 112, revenue: 42000, createdAt: "2024-02-25", subject: "Your subscription renews in 30 days", audience: "Expiring Soon", unsubscribed: 8 },
    { id: 8, name: "Cold Outreach Feb", type: "SMS", status: "completed", sent: 1800, opened: 1260, clicked: 270, converted: 54, revenue: 16200, createdAt: "2024-02-05", subject: "Quick question about [Company]'s CRM...", audience: "Cold Leads", unsubscribed: 94 }
  ],

  appointments: [
    { id: 1, title: "Product Demo - James Mitchell", contact: "James Mitchell", email: "james.mitchell@techcorp.com", date: "2024-03-18", time: "10:00 AM", duration: 60, type: "Demo", status: "confirmed", notes: "Screen share needed" },
    { id: 2, title: "Discovery Call - Ryan Baker", contact: "Ryan Baker", email: "r.baker@cybersec.tech", date: "2024-03-18", time: "02:00 PM", duration: 45, type: "Discovery", status: "confirmed", notes: "Focus on security compliance" },
    { id: 3, title: "Follow-up - Sarah Thompson", contact: "Sarah Thompson", email: "s.thompson@marketpro.io", date: "2024-03-19", time: "11:00 AM", duration: 30, type: "Follow-up", status: "confirmed", notes: "Pricing discussion" },
    { id: 4, title: "Onboarding - David Chen", contact: "David Chen", email: "dchen@globalventures.com", date: "2024-03-19", time: "03:00 PM", duration: 90, type: "Onboarding", status: "confirmed", notes: "Technical setup walkthrough" },
    { id: 5, title: "Contract Review - Robert Williams", contact: "Robert Williams", email: "rwilliams@financeplus.com", date: "2024-03-20", time: "09:00 AM", duration: 60, type: "Contract", status: "pending", notes: "Legal team joining" },
    { id: 6, title: "Demo - Christopher King", contact: "Christopher King", email: "cking@manufacturing.co", date: "2024-03-21", time: "01:00 PM", duration: 60, type: "Demo", status: "confirmed", notes: "ERP integration questions" },
    { id: 7, title: "Check-in - Andrew Harris", contact: "Andrew Harris", email: "a.harris@logistics.net", date: "2024-03-22", time: "10:30 AM", duration: 30, type: "Check-in", status: "confirmed", notes: "Monthly account review" },
    { id: 8, title: "Strategy Call - Angela Davis", contact: "Angela Davis", email: "adavis@pharma.health", date: "2024-03-25", time: "02:30 PM", duration: 60, type: "Strategy", status: "confirmed", notes: "Q2 expansion planning" },
    { id: 9, title: "Trial Walkthrough - Megan Clark", contact: "Megan Clark", email: "mclark@educationtech.edu", date: "2024-03-26", time: "11:00 AM", duration: 45, type: "Demo", status: "pending", notes: "Education vertical focus" },
    { id: 10, title: "Renewal Disc. - Jason Turner", contact: "Jason Turner", email: "j.turner@autogroup.cars", date: "2024-03-27", time: "03:30 PM", duration: 30, type: "Renewal", status: "confirmed", notes: "Expansion to 5 more locations" }
  ],

  conversations: [
    { id: 1, contact: "James Mitchell", avatar: "JM", channel: "email", lastMessage: "Hi, I reviewed the proposal and have a few questions about the enterprise tier pricing...", time: "10:24 AM", unread: 2, status: "open", messages: [
      { from: "them", text: "Hi! I received your proposal. The features look great.", time: "9:00 AM" },
      { from: "me", text: "Thanks James! Happy to hear that. Do you have any questions I can address?", time: "9:15 AM" },
      { from: "them", text: "Yes, I'd like to understand the difference between the Professional and Enterprise tiers.", time: "9:45 AM" },
      { from: "me", text: "Great question! The Enterprise tier includes unlimited contacts, custom integrations, dedicated support, and SSO. Want me to put together a comparison doc?", time: "10:00 AM" },
      { from: "them", text: "Hi, I reviewed the proposal and have a few questions about the enterprise tier pricing...", time: "10:24 AM" }
    ]},
    { id: 2, contact: "Sarah Thompson", avatar: "ST", channel: "sms", lastMessage: "Can we reschedule Tuesday's call to Wednesday?", time: "Yesterday", unread: 1, status: "open", messages: [
      { from: "me", text: "Hi Sarah, just confirming our call for Tuesday at 11am. Will that still work?", time: "Mar 11, 2:00 PM" },
      { from: "them", text: "Can we reschedule Tuesday's call to Wednesday?", time: "Mar 11, 4:30 PM" }
    ]},
    { id: 3, contact: "David Chen", avatar: "DC", channel: "email", lastMessage: "Looking forward to onboarding next week! We're very excited.", time: "Yesterday", unread: 0, status: "closed", messages: [
      { from: "them", text: "I'm ready to move forward. How do we proceed?", time: "Mar 13, 10:00 AM" },
      { from: "me", text: "Fantastic David! I'll send over the contract and onboarding calendar today.", time: "Mar 13, 10:30 AM" },
      { from: "them", text: "Looking forward to onboarding next week! We're very excited.", time: "Mar 13, 2:00 PM" }
    ]},
    { id: 4, contact: "Michael Brown", avatar: "MB", channel: "email", lastMessage: "We need custom pricing for all 50 locations. Can you work with that?", time: "Mar 12", unread: 3, status: "open", messages: [
      { from: "them", text: "We have 50 retail locations and need a volume discount.", time: "Mar 12, 9:00 AM" },
      { from: "me", text: "Absolutely! Let me get our account team to put together a custom quote.", time: "Mar 12, 11:00 AM" },
      { from: "them", text: "We need custom pricing for all 50 locations. Can you work with that?", time: "Mar 12, 3:00 PM" }
    ]},
    { id: 5, contact: "Robert Williams", avatar: "RW", channel: "email", lastMessage: "Our legal team will need 2 weeks to review the contract.", time: "Mar 12", unread: 0, status: "open", messages: [
      { from: "them", text: "We've reviewed the proposal. It looks very promising.", time: "Mar 11, 10:00 AM" },
      { from: "me", text: "Great! Are you ready to move to contract stage?", time: "Mar 11, 11:00 AM" },
      { from: "them", text: "Our legal team will need 2 weeks to review the contract.", time: "Mar 12, 9:00 AM" }
    ]},
    { id: 6, contact: "Jennifer Lee", avatar: "JL", channel: "sms", lastMessage: "Perfect. See you on Monday for onboarding!", time: "Mar 11", unread: 0, status: "closed", messages: [
      { from: "me", text: "Jennifer, your HIPAA documentation has been approved. Ready to kick things off?", time: "Mar 10, 1:00 PM" },
      { from: "them", text: "Yes! When can we schedule onboarding?", time: "Mar 10, 2:00 PM" },
      { from: "me", text: "How about Monday March 19th at 3pm?", time: "Mar 10, 2:15 PM" },
      { from: "them", text: "Perfect. See you on Monday for onboarding!", time: "Mar 11, 9:00 AM" }
    ]},
    { id: 7, contact: "Kevin Martinez", avatar: "KM", channel: "sms", lastMessage: "Sounds great! What's the setup process like?", time: "Mar 10", unread: 1, status: "open", messages: [
      { from: "me", text: "Hi Kevin, thanks for your interest in our abandoned cart automation!", time: "Mar 9, 10:00 AM" },
      { from: "them", text: "Yes, we lose a lot of revenue to cart abandonment.", time: "Mar 9, 11:00 AM" },
      { from: "me", text: "Our SMS automation recovers up to 15% of abandoned carts on average.", time: "Mar 9, 11:30 AM" },
      { from: "them", text: "Sounds great! What's the setup process like?", time: "Mar 10, 9:00 AM" }
    ]},
    { id: 8, contact: "Thomas Anderson", avatar: "TA", channel: "email", lastMessage: "Our CTO wants to review the API documentation before we proceed.", time: "Mar 10", unread: 0, status: "open", messages: [
      { from: "them", text: "We're interested in the developer API for custom integrations.", time: "Mar 8, 2:00 PM" },
      { from: "me", text: "We have a comprehensive REST API. I'll send you our developer docs.", time: "Mar 8, 3:00 PM" },
      { from: "them", text: "Our CTO wants to review the API documentation before we proceed.", time: "Mar 10, 10:00 AM" }
    ]},
    { id: 9, contact: "Jason Turner", avatar: "JT", channel: "sms", lastMessage: "Can you handle multi-location reporting? That's critical for us.", time: "Mar 9", unread: 2, status: "open", messages: [
      { from: "me", text: "Hi Jason! Following up on your demo last week.", time: "Mar 8, 9:00 AM" },
      { from: "them", text: "It was great. Team loved the automation features.", time: "Mar 8, 11:00 AM" },
      { from: "them", text: "Can you handle multi-location reporting? That's critical for us.", time: "Mar 9, 8:30 AM" }
    ]},
    { id: 10, contact: "Patricia Lewis", avatar: "PL", channel: "email", lastMessage: "The compliance team has a few outstanding questions about data residency.", time: "Mar 9", unread: 0, status: "open", messages: [
      { from: "them", text: "We're interested but need to confirm your data security certifications.", time: "Mar 7, 10:00 AM" },
      { from: "me", text: "We're SOC2 Type II certified and GDPR compliant. I'll send our security whitepaper.", time: "Mar 7, 11:00 AM" },
      { from: "them", text: "The compliance team has a few outstanding questions about data residency.", time: "Mar 9, 2:00 PM" }
    ]},
    { id: 11, contact: "Angela Davis", avatar: "AD", channel: "email", lastMessage: "Congratulations to the team! We're thrilled to be partnering with LeadFlow.", time: "Mar 8", unread: 0, status: "closed", messages: [
      { from: "them", text: "We've finalized our review. LeadFlow is the right platform for PharmaCo.", time: "Mar 8, 9:00 AM" },
      { from: "me", text: "Angela, this is amazing news! We're so excited to have PharmaCo on board!", time: "Mar 8, 9:30 AM" },
      { from: "them", text: "Congratulations to the team! We're thrilled to be partnering with LeadFlow.", time: "Mar 8, 10:00 AM" }
    ]},
    { id: 12, contact: "Ryan Baker", avatar: "RB", channel: "email", lastMessage: "We'll need a penetration test report and SOC2 certification before final sign-off.", time: "Mar 8", unread: 1, status: "open", messages: [
      { from: "them", text: "Security is our top priority. What certifications does LeadFlow hold?", time: "Mar 7, 2:00 PM" },
      { from: "me", text: "We hold SOC2 Type II, ISO 27001, and conduct annual pen tests. Happy to share reports.", time: "Mar 7, 3:30 PM" },
      { from: "them", text: "We'll need a penetration test report and SOC2 certification before final sign-off.", time: "Mar 8, 11:00 AM" }
    ]},
    { id: 13, contact: "Nicole Scott", avatar: "NS", channel: "sms", lastMessage: "Awesome! Send me pricing for the 3-market expansion plan.", time: "Mar 7", unread: 0, status: "open", messages: [
      { from: "me", text: "Hi Nicole! Heard you're expanding to 3 new markets. Congrats!", time: "Mar 6, 10:00 AM" },
      { from: "them", text: "Yes! It's an exciting time for us.", time: "Mar 6, 11:30 AM" },
      { from: "me", text: "LeadFlow can help you manage leads across all locations from one dashboard.", time: "Mar 6, 12:00 PM" },
      { from: "them", text: "Awesome! Send me pricing for the 3-market expansion plan.", time: "Mar 7, 9:00 AM" }
    ]},
    { id: 14, contact: "Megan Clark", avatar: "MC", channel: "email", lastMessage: "Does LeadFlow integrate with Google Classroom and Remind?", time: "Mar 7", unread: 0, status: "open", messages: [
      { from: "them", text: "We're looking for a CRM that works well for school-to-parent communication.", time: "Mar 6, 2:00 PM" },
      { from: "me", text: "Absolutely! Our platform supports email, SMS, and push notifications for any audience.", time: "Mar 6, 3:00 PM" },
      { from: "them", text: "Does LeadFlow integrate with Google Classroom and Remind?", time: "Mar 7, 10:00 AM" }
    ]},
    { id: 15, contact: "Daniel White", avatar: "DW", channel: "sms", lastMessage: "Robert spoke highly of your platform. Excited to learn more!", time: "Mar 6", unread: 0, status: "open", messages: [
      { from: "me", text: "Hi Daniel! Robert Williams suggested I reach out. He thought LeadFlow could be a great fit for your consulting practice.", time: "Mar 5, 2:00 PM" },
      { from: "them", text: "Robert spoke highly of your platform. Excited to learn more!", time: "Mar 6, 9:00 AM" }
    ]},
    { id: 16, contact: "Christine Young", avatar: "CY", channel: "sms", lastMessage: "Perfect, 10 locations confirmed. Let's book a call!", time: "Mar 5", unread: 0, status: "open", messages: [
      { from: "me", text: "Hi Christine! We have great success with restaurant groups using our SMS loyalty campaigns.", time: "Mar 4, 11:00 AM" },
      { from: "them", text: "We have 10 locations and want to improve customer retention.", time: "Mar 4, 1:00 PM" },
      { from: "me", text: "Excellent! SMS campaigns average 98% open rates in the restaurant vertical.", time: "Mar 4, 2:00 PM" },
      { from: "them", text: "Perfect, 10 locations confirmed. Let's book a call!", time: "Mar 5, 9:00 AM" }
    ]},
    { id: 17, contact: "Andrew Harris", avatar: "AH", channel: "email", lastMessage: "Everything is running smoothly. The automations have saved us 10 hours/week!", time: "Mar 4", unread: 0, status: "closed", messages: [
      { from: "me", text: "Hi Andrew, just doing your monthly check-in. How is everything going?", time: "Mar 4, 10:00 AM" },
      { from: "them", text: "Everything is running smoothly. The automations have saved us 10 hours/week!", time: "Mar 4, 11:30 AM" }
    ]},
    { id: 18, contact: "Brandon Hall", avatar: "BH", channel: "sms", lastMessage: "Can LeadFlow send automatic re-engagement texts to members who haven't visited in 30 days?", time: "Mar 3", unread: 1, status: "open", messages: [
      { from: "them", text: "We're losing members who just stop coming in. Any solutions?", time: "Mar 2, 3:00 PM" },
      { from: "me", text: "Yes! We can automate re-engagement campaigns triggered by inactivity.", time: "Mar 2, 4:00 PM" },
      { from: "them", text: "Can LeadFlow send automatic re-engagement texts to members who haven't visited in 30 days?", time: "Mar 3, 10:00 AM" }
    ]},
    { id: 19, contact: "Christopher King", avatar: "CK", channel: "email", lastMessage: "Our procurement committee meets on the 22nd. We'll have a decision shortly after.", time: "Mar 3", unread: 0, status: "open", messages: [
      { from: "me", text: "Christopher, just following up on the proposal we sent last week.", time: "Mar 1, 10:00 AM" },
      { from: "them", text: "We're still in review. Large purchases require committee approval here.", time: "Mar 1, 2:00 PM" },
      { from: "me", text: "Completely understand. Is there anything I can provide to help the committee?", time: "Mar 2, 9:00 AM" },
      { from: "them", text: "Our procurement committee meets on the 22nd. We'll have a decision shortly after.", time: "Mar 3, 11:00 AM" }
    ]},
    { id: 20, contact: "Stephanie Moore", avatar: "SM", channel: "sms", lastMessage: "Found you via Instagram! What plans do you have for small fashion brands?", time: "Mar 2", unread: 1, status: "open", messages: [
      { from: "them", text: "Found you via Instagram! What plans do you have for small fashion brands?", time: "Mar 2, 2:00 PM" }
    ]}
  ],

  workflows: [
    { id: 1, name: "New Lead Welcome Sequence", triggers: 3, actions: 8, status: "active", contacts: 1240, lastRun: "2024-03-15" },
    { id: 2, name: "Demo Follow-Up Automation", triggers: 1, actions: 5, status: "active", contacts: 340, lastRun: "2024-03-14" },
    { id: 3, name: "Abandoned Cart Recovery", triggers: 2, actions: 6, status: "active", contacts: 892, lastRun: "2024-03-15" },
    { id: 4, name: "Re-engagement Campaign", triggers: 1, actions: 4, status: "paused", contacts: 567, lastRun: "2024-03-10" },
    { id: 5, name: "Renewal Reminder Sequence", triggers: 1, actions: 7, status: "active", contacts: 213, lastRun: "2024-03-13" }
  ],

  funnels: [
    { id: 1, name: "Free Trial Funnel", pages: 4, visitors: 12400, conversions: 1488, rate: 12.0, revenue: 148800, status: "active" },
    { id: 2, name: "Webinar Registration", pages: 2, visitors: 8900, conversions: 2136, rate: 24.0, revenue: 42720, status: "active" },
    { id: 3, name: "Enterprise Demo Request", pages: 3, visitors: 3200, conversions: 384, rate: 12.0, revenue: 192000, status: "active" },
    { id: 4, name: "SMB Quick Start", pages: 5, visitors: 6700, conversions: 804, rate: 12.0, revenue: 40200, status: "active" },
    { id: 5, name: "Ebook Lead Magnet", pages: 2, visitors: 15600, conversions: 4680, rate: 30.0, revenue: 23400, status: "active" },
    { id: 6, name: "Annual Plan Upsell", pages: 3, visitors: 2100, conversions: 378, rate: 18.0, revenue: 94500, status: "paused" }
  ],

  revenueData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [42000, 58000, 67000, 71000, 84000, 92000, 88000, 95000, 112000, 108000, 124000, 138000]
  },

  leadsData: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    data: [120, 145, 189, 201, 230, 267, 245, 289, 312, 298, 334, 367]
  },

  kpis: {
    totalLeads: 2847,
    totalRevenue: 487200,
    appointments: 156,
    conversionRate: 24.8,
    leadsTrend: 12.4,
    revenueTrend: 18.2,
    appointmentsTrend: 8.7,
    conversionTrend: 3.1
  },

  activities: [
    { type: "deal_won", text: "Deal closed with Angela Davis - $65,000", time: "2 hours ago", icon: "trophy", color: "green" },
    { type: "new_lead", text: "New lead: Stephanie Moore from FashionBrand Co.", time: "3 hours ago", icon: "user-plus", color: "blue" },
    { type: "appointment", text: "Demo scheduled with Christopher King", time: "4 hours ago", icon: "calendar", color: "purple" },
    { type: "email_open", text: "Robert Williams opened 'Enterprise Proposal'", time: "5 hours ago", icon: "envelope-open", color: "yellow" },
    { type: "new_lead", text: "New lead: Brandon Hall from Peak Sports Club", time: "6 hours ago", icon: "user-plus", color: "blue" },
    { type: "deal_won", text: "Deal closed with Jennifer Lee - $12,000", time: "Yesterday", icon: "trophy", color: "green" },
    { type: "campaign", text: "Campaign 'Q1 Welcome Series' reached 4,820 contacts", time: "Yesterday", icon: "paper-plane", color: "indigo" },
    { type: "appointment", text: "Ryan Baker confirmed demo for March 18", time: "Yesterday", icon: "calendar", color: "purple" }
  ]
};

function initializeData() {
  if (!localStorage.getItem('lf_contacts')) {
    localStorage.setItem('lf_contacts', JSON.stringify(AppData.contacts));
  }
  if (!localStorage.getItem('lf_opportunities')) {
    localStorage.setItem('lf_opportunities', JSON.stringify(AppData.opportunities));
  }
  if (!localStorage.getItem('lf_campaigns')) {
    localStorage.setItem('lf_campaigns', JSON.stringify(AppData.campaigns));
  }
  if (!localStorage.getItem('lf_conversations')) {
    localStorage.setItem('lf_conversations', JSON.stringify(AppData.conversations));
  }
  if (!localStorage.getItem('lf_appointments')) {
    localStorage.setItem('lf_appointments', JSON.stringify(AppData.appointments));
  }
}

function getData(key) {
  const stored = localStorage.getItem(`lf_${key}`);
  return stored ? JSON.parse(stored) : (AppData[key] || []);
}

function saveData(key, data) {
  localStorage.setItem(`lf_${key}`, JSON.stringify(data));
}
