import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Banner = () => {
  const router = useRouter();
  const [currentContent, setCurrentContent] = useState({
    title: "The Juiz Lab",
    subtitle: "Cooking Community",
    bgColor: "from-gray-700 to-gray-900",
  });

  useEffect(() => {
    // Define banner content based on current path
    const getBannerContent = () => {
      const path = router.pathname;
      console.log("Current path:", path); // Debug log

      const bannerConfig = {
        "/": {
          title: "Welcome to The Juiz Lab",
          subtitle: "Your Ultimate Cooking Community",
          bgColor: "from-[#6B8E23] to-[#8FBC8F]",
        },
        "/recipe": {
          title: "Recipes",
          subtitle: "Discover and Share Amazing Recipes",
          bgColor: "from-[#E07B50] to-[#FFA07A]",
        },
        "/tutorial": {
          title: "Tutorials",
          subtitle: "Learn Cooking Techniques from Experts",
          bgColor: "from-[#4682B4] to-[#87CEEB]",
        },
        "/community": {
          title: "Community",
          subtitle: "Connect with Fellow Food Enthusiasts",
          bgColor: "from-[#8B4513] to-[#DEB887]",
        },
        "/about": {
          title: "About Us",
          subtitle: "Our Story and Mission",
          bgColor: "from-[#2F4F4F] to-[#708090]",
        },
        "/profile": {
          title: "My Profile",
          subtitle: "Manage Your Content and Settings",
          bgColor: "from-[#4B0082] to-[#8A2BE2]",
        },
        "/recipe/add": {
          title: "Add New Recipe",
          subtitle: "Share Your Culinary Creation",
          bgColor: "from-[#E07B50] to-[#FFA07A]",
        },
        "/tutorial/add": {
          title: "Create Tutorial",
          subtitle: "Share Your Cooking Knowledge",
          bgColor: "from-[#4682B4] to-[#87CEEB]",
        },
        "/community/blog/add": {
          title: "Write Blog Post",
          subtitle: "Share Your Culinary Journey",
          bgColor: "from-[#8B4513] to-[#DEB887]",
        },
      };

      // Find the most specific matching path
      const matchingPaths = Object.keys(bannerConfig).filter((configPath) =>
        path.startsWith(configPath)
      );

      // Sort by length to get the most specific match
      const bestMatch = matchingPaths.sort((a, b) => b.length - a.length)[0];

      console.log("Best matching path:", bestMatch); // Debug log

      return bestMatch
        ? bannerConfig[bestMatch]
        : {
            title: "The Juiz Lab",
            subtitle: "Cooking Community",
            bgColor: "from-gray-700 to-gray-900",
          };
    };

    const newContent = getBannerContent();
    setCurrentContent(newContent);
  }, [router.pathname]); // Update when pathname changes

  return (
    <div
      className={`relative w-full mb-6 overflow-hidden rounded-lg shadow-lg`}
    >
      {/* Background with gradient */}
      <div className={`w-full h-48 bg-gradient-to-r ${currentContent.bgColor}`}>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-8">
          <h1 className="text-4xl font-bold text-white mb-2 tracking-wide">
            {currentContent.title}
          </h1>
          <p className="text-xl text-white/90">{currentContent.subtitle}</p>
        </div>

        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Banner;
