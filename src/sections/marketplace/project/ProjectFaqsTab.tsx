"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function ProjectFaqsTab() {
  const t = useTranslations(
    "Marketplace.project.projectDetails.projectFaqsTab"
  );

  const projectFaqs = [
    {
      id: 1,
      title: t("faq1.title"),
      content: t("faq1.content"),
    },
    {
      id: 2,
      title: t("faq2.title"),
      content: t("faq2.content"),
    },
    {
      id: 3,
      title: t("faq3.title"),
      content: t("faq3.content"),
    },
    {
      id: 4,
      title: t("faq4.title"),
      content: t("faq4.content"),
    },
    {
      id: 5,
      title: t("faq5.title"),
      content: t("faq5.content"),
    },
    {
      id: 6,
      title: t("faq6.title"),
      content: t("faq6.content"),
    },
    {
      id: 7,
      title: t("faq7.title"),
      content: t("faq7.content"),
    },
    {
      id: 8,
      title: t("faq8.title"),
      content: t("faq8.content"),
    },
    {
      id: 9,
      title: t("faq9.title"),
      content: t("faq9.content"),
    },
    {
      id: 10,
      title: t("faq10.title"),
      content: t("faq10.content"),
    },
  ];

  return (
    <div className="h-full w-full">
      <Accordion className="w-full">
        {projectFaqs.map((item) => (
          <AccordionItem
            key={item.id}
            aria-label={item.title}
            title={
              <h1 className="font-sen text-lg font-semibold text-primary dark:text-light">
                {item.title}
              </h1>
            }
            className="w-full text-primary dark:text-light"
          >
            {item.content}
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
