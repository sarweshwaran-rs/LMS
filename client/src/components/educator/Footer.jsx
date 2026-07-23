import { assets } from "../../assets/assets"

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-colflex-col-reverse items-center justify-between text-left w-full px-8 border-t">
      {/* Left Column */}
      <div className="flex items-center gap-4">
        <img className="hidden md:block w-20" src={assets.logo} alt="logo" />
        <div className="hidden md:block h-8 w-px bg-gray-500/60"></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          Copyright {new Date().getFullYear()} @ GreatStack. All Right Reserved.
        </p>
      </div>

      {/* Right Column */}
      <div className="flex items-center gap-3 max-md:mt-4">
        <a href="#">
          <img src={assets.facebook_icon} alt="facebook_icon" className="" />
        </a>
        <a href="#">
          <img src={assets.twitter_icon} alt="twitter_icon" className="" />
        </a>
        <a href="#">
          <img src={assets.instagram_icon} alt="instagram_icon" className="" />
        </a>
      </div>
    </footer>
  )
}

export default Footer
