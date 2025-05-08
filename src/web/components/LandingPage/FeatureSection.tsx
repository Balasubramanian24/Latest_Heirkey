import HeroTwo from "@/assets/webappimage/LandingPage/HeroTwo.jpg"

export default function FeatureSection() {
    return (
      <section className="py-20 bg-white">

        <div className="pr-32 pl-32 mb-20">
            <img src={HeroTwo} alt="Heirkey platform preview" />
        </div>

    <div className="bg-gray-100 py-12 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            What is Heirkey
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Losing a loved one is a stressful and emotional time. No matter how well prepared you might think you are for this trying time, people are continually shocked by the number of tasks you have to do in a limited time.
          </p>
          <p className="text-gray-700 leading-relaxed">
            One of the biggest hurdles is finding all the necessary information about the deceased and their life. People spend days, sometimes months, searching through paperwork, bills, and cluttered homes. We now live in a digital age which can be helpful but also add another complication. With countless passwords and logins, loved ones can be locked out of critical digital services such as banking, utilities, insurance, cell phone plans, cable, and so much more.
          </p>
        </div>

        <div className="flex gap-4">
          <div>
            <p className="text-gray-900 font-semibold mb-2">
              HeirKey solves all of that. On the HeirKey website, you can securely store the essential information you would like to pass on to your heir at the time of your passing. Information such as:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Location of Will</li>
              <li>Funeral Arrangements / After-Life Arrangements</li>
              <li>Contacts of Important People</li>
              <li>Home Instructions and Home Documents</li>
              <li>Insurance and Medical Documents</li>
              <li>Financial Documents</li>
              <li>Ownership Documents</li>
              <li>
                Services to Disconnect with Passwords like Utilities and Digital Services 
                        (Cable, Internet, Cellphone)
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>
      </section>
    );
  }

  