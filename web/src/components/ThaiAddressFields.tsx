"use client";

import { useEffect, useState } from "react";
import { usePrefs } from "./PreferencesProvider";

export type ThaiAddressValue = {
  line: string;
  province: string;
  district: string;
  subdistrict: string;
  zip: string;
};

type Props = {
  value: ThaiAddressValue;
  onChange: (next: ThaiAddressValue) => void;
};

export function formatFullAddress(v: ThaiAddressValue) {
  return [v.line, `ต.${v.subdistrict}`, `อ.${v.district}`, `จ.${v.province}`, v.zip]
    .filter(Boolean)
    .join(" ");
}

export function ThaiAddressFields({ value, onChange }: Props) {
  const { t } = usePrefs();
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [subs, setSubs] = useState<{ name: string; zip: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Keep Thai names in values so cascading + saved address stay consistent.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { setEngMode, getProvinceAll } = await import(
        "thai-address-universal"
      );
      await setEngMode(false);
      const list = await getProvinceAll();
      if (!cancelled) {
        setProvinces(list);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!value.province) {
      setDistricts([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { getDistrictByProvince, setEngMode } = await import(
        "thai-address-universal"
      );
      await setEngMode(false);
      const list = await getDistrictByProvince(value.province);
      if (!cancelled) setDistricts(list);
    })();
    return () => {
      cancelled = true;
    };
  }, [value.province]);

  useEffect(() => {
    if (!value.district) {
      setSubs([]);
      return;
    }
    let cancelled = false;
    (async () => {
      const { getSubDistricts, setEngMode } = await import(
        "thai-address-universal"
      );
      await setEngMode(false);
      const list = await getSubDistricts(value.district);
      if (!cancelled) {
        setSubs(
          list.map((s) => ({
            name: s.nameTh,
            zip: s.postalCode ?? "",
          })),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value.district]);

  function patch(partial: Partial<ThaiAddressValue>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="space-y-3">
      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">{t("addrLine")}</span>
        <textarea
          required
          className="field"
          rows={2}
          value={value.line}
          onChange={(e) => patch({ line: e.target.value })}
          placeholder={t("addrLinePh")}
        />
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">{t("addrProvince")}</span>
        <select
          required
          className="field"
          disabled={loading}
          value={value.province}
          onChange={(e) =>
            patch({
              province: e.target.value,
              district: "",
              subdistrict: "",
              zip: "",
            })
          }
        >
          <option value="">{t("addrPickProvince")}</option>
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">{t("addrDistrict")}</span>
        <select
          required
          className="field"
          disabled={!value.province}
          value={value.district}
          onChange={(e) =>
            patch({
              district: e.target.value,
              subdistrict: "",
              zip: "",
            })
          }
        >
          <option value="">{t("addrPickDistrict")}</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">{t("addrSubdistrict")}</span>
        <select
          required
          className="field"
          disabled={!value.district}
          value={value.subdistrict}
          onChange={(e) => {
            const name = e.target.value;
            const hit = subs.find((s) => s.name === name);
            patch({
              subdistrict: name,
              zip: hit?.zip ?? "",
            });
          }}
        >
          <option value="">{t("addrPickSubdistrict")}</option>
          {subs.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="text-muted">{t("addrZip")}</span>
        <input
          required
          className="field"
          value={value.zip}
          readOnly
          placeholder={t("addrZipAuto")}
        />
      </label>
    </div>
  );
}
