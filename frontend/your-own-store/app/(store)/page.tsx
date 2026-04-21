import AppLogo from "@/components/AppLogo";
import CurrentLocation from "@/components/store/header/CurrentLocation";
import StoreSearchBar from "@/components/store/header/StoreSearchBar";
import StoreLanguageSelector from "@/components/store/header/StoreLanguageSelector";
import StoreSignInProfile from "@/components/store/header/StoreSignInProfile";
import StoreCartIcon from "@/components/store/header/StoreCartIcon";



function MainStorePage() {
  return (
    <div className="max-w-full max-h-full flex flex-col">
      {/* header */}
      <div className="min-h-16 bg-slate-900 w-full text-white flex flex-row justify-between items-center gap-4 px-4 py-2">
        {/* App logo */}
        <AppLogo />
        {/* location */}
        <CurrentLocation location={"Nigeria"} />
        {/* Search bar */}
        <StoreSearchBar />
        {/* language */}
        <StoreLanguageSelector />
        {/* profile */}
        <StoreSignInProfile name={"sign in"}/>
        {/* Cart icon */}
        <StoreCartIcon cartCount={0}/>
      </div>

      {/* Navbar */}
      <div className="min-h-8 bg-slate-800/90 w-full text-white">
        {/* navicon with nav items */}

        {/* towards the end an info */}
      </div>

      {/* Shop by Category Title */}

      {/* Category grids that leads to other pages */}
    </div>
  );
}

export default MainStorePage;
