import logoFooter from "@/assets/webappimage/logo/logoFooter.png";

const footerLinks = [
  {
    heading: "Home Instructions",
    links: [
      { label: "Pets", href: "#" },
      { label: "Trash", href: "#" },
      { label: "Others", href: "#", badge: "New" },
      { label: "Security", href: "#" }
    ],
  },
  {
    heading: "Home Documents",
    links: [
      { label: "Electricity", href: "#" },
      { label: "Gas", href: "#" },
      { label: "Water", href: "#" },
      { label: "Trash", href: "#" },
      { label: "HVAC", href: "#" },
      { label: "Pest", href: "#" },
      { label: "Lawn", href: "#" },
      { label: "Cable", href: "#" },
      { label: "Internet", href: "#" }
    ],
  },
  {
    heading: "Funeral Arrangements",
    links: [
      { label: "Details", href: "#" },
      { label: "Ceremony Location", href: "#" },
      { label: "Clergy", href: "#" },
      { label: "Notifications", href: "#" },
      { label: "Proceedings", href: "#" }
    ],
  },
  {
    heading: "Contacts",
    links: [
      { label: "Friends/Family", href: "#" },
      { label: "Work", href: "#" },
      { label: "Religion", href: "#" },
      { label: "Clubs", href: "#" },
    ],
  },
  {
    heading: "Will & Testament",
    links: [
      { label: "Location", href: "#" },
      { label: "Legal Representation", href: "#" },
    ],
  },
  {
    heading: "Socail Media and Phone",
    links: [
      { label: "Email", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "Instagram", href: "#" },
      { label: "Other Socails", href: "#" },
      { label: "Cell Phone", href: "#" },
    ],
  },
];


const Footer = () => {
  return (
    <div className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-6 gap-8">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase mb-4">retail</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-800 hover:underline">Overview</a></li>
              <li><a href="#" className="text-gray-800 hover:underline">Features</a></li>
              <li className="flex items-center gap-2">
                <a href="#" className="text-gray-800 hover:underline">Solutions</a>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">New</span>
              </li>
              <li><a href="#" className="text-gray-800 hover:underline">Tutorials</a></li>
              <li><a href="#" className="text-gray-800 hover:underline">Pricing</a></li>
              <li><a href="#" className="text-gray-800 hover:underline">Releases</a></li>
            </ul>
          </div>
          {footerLinks.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-xs font-semibold text-gray-700 uppercase mb-4">{section.heading}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx} className="flex items-center gap-2">
                    <a href={link.href} className="text-gray-800 hover:underline text-xs">
                      {link.label}
                    </a>
                    {link.badge && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
          <img src={logoFooter} alt="Heirkey Logo" className="h-10 w-auto mb-4 sm:mb-0" />
          <p className="text-sm text-gray-500 text-center sm:text-right">
            © 2025 Heirkey. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
