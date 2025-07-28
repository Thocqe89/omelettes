
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("la")}>ລາວ</button>
      <button onClick={() => changeLanguage("zh")}>中文</button>
      <button onClick={() => changeLanguage("th")}>ไทย</button>
      
    </div>
  );
};

export default LanguageSwitcher;