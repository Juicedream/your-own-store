import Link from "next/link";
import { TbBrandAmazon } from "react-icons/tb";

const AppLogo = () => {
  return (
    <div className="flex relative">
      <Link href="/">
        <TbBrandAmazon
          size={45}
          className="absolute -top-5 rotate-190 right-4 text-orange-600"
        />
        <h1 className="text-2xl font-bold">Y~O~S</h1>
        <TbBrandAmazon
          size={45}
          className="absolute -bottom-5 right-4 text-orange-600"
        />
      </Link>
    </div>
  );
};

export default AppLogo;
