import { computed, h, type Component } from "vue";
import { useI18n } from "vue-i18n";
import { PersonSharp, Speedometer } from "@vicons/ionicons5";
import { NIcon } from "naive-ui";
import {
  Box24Filled,
  CommunicationPerson24Regular,
  ContactCard24Filled,
  DataUsage24Filled,
  Filter24Filled,
  FolderPerson20Filled,
  MyLocation24Regular,
  NotepadPerson24Filled,
} from "@vicons/fluent";

function renderIcon(icon: Component, size = 20) {
  return () => h(NIcon, { size }, { default: () => h(icon) });
}

export default function useMenu() {
  const { t } = useI18n(); // Access translation function

  const menuOptions = computed(() => [
    {
      label: t("sidebar.dashboard"), // Now updates when the language changes
      key: "dashboard",
      icon: renderIcon(Speedometer),
    },
    {
      label: t("sidebar.crm"),
      key: "crm",
      icon: renderIcon(Filter24Filled),
    },
    {
      label: t("sidebar.information"),
      key: "information",
      icon: renderIcon(DataUsage24Filled),
    },
  ]);

  return { menuOptions };
}
export function getMenuChild(parent_key: string) {
  const { t } = useI18n();

  return computed(() => {
    if (parent_key === "information") {
      return [
        {
          icon: renderIcon(Box24Filled),
          label: t("sidebar.products"),
          key: "products",
        },
        {
          icon: renderIcon(FolderPerson20Filled),
          label: t("sidebar.users"),
          key: "users",
        },
        {
          icon: renderIcon(MyLocation24Regular),
          label: t("sidebar.regions"),
          key: "regions",
        },
        {
          label: t("sidebar.contacts"),
          icon: renderIcon(ContactCard24Filled),
          key: "contacts",
          children: [
            {
              icon: renderIcon(CommunicationPerson24Regular),
              label: t("sidebar.clients"),
              key: "clients",
            },
            {
              icon: renderIcon(NotepadPerson24Filled),
              label: t("sidebar.suppliers"),
              key: "suppliers",
            },
          ],
        },
        {
          icon: renderIcon(
            h(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                viewBox: "0 0 24 24",
                fill: "currentColor",
              },
              [
                h("path", {
                  d: "M19 7c0-1.1-.9-2-2-2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2.65L13.52 14H10v-4c0-.55-.45-1-1-1H6c-2.21 0-4 1.79-4 4v2c0 .55.45 1 1 1h1c0 1.66 1.34 3 3 3s3-1.34 3-3h3.52c.61 0 1.18-.28 1.56-.75l3.48-4.35c.29-.36.44-.8.44-1.25V7zM7 17c-.55 0-1-.45-1-1h2c0 .55-.45 1-1 1z",
                }),
                h("path", {
                  d: "M6 6h3c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1zm13 7c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1z",
                }),
              ]
            )
          ),
          label: t("sidebar.delivery-man"),
          key: "delivery-man",
        },
      ];
    }
    return [];
  });
}
