import styles from "@/styles/Search.module.css";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Search() {
  const [term, setTerm] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    router.push(`/events/search?term=${term}`);
    setTerm("");
  }

  function handleChange(e) {
    setTerm(e.target.value);
  }

  const router = useRouter();

  return (
    <div className={styles.search}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={term}
          onChange={handleChange}
          placeholder="Search Events"
        />
      </form>
    </div>
  );
}
