import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Star } from "lucide-react";
import type { PricingPlan as PricingPlanModel } from "@/lib/types";
import { supabase } from "@/lib/supabase";

interface PricingPlan extends PricingPlanModel {
  popular?: boolean;
  icon: React.ReactNode;
}

const defaultPlans: PricingPlan[] = [
  {
    id: "trial",
    name: "ПРОБНЕ",
    price: 150,
    period: "грн",
    description: "Перше заняття для новачків",
    features: [
      "1 пробне заняття",
      "Вибір будь-якого напрямку",
      "Знайомство з тренером",
      "Оцінка рівня",
    ],
    icon: <Star className="w-6 h-6" />,
    active: true,
  },
  {
    id: "single",
    name: "РАЗОВЕ",
    price: 200,
    period: "грн",
    description: "Одне заняття без абонементу",
    features: [
      "1 заняття 60 хв",
      "Будь-який напрямок",
      "Гнучкий графік",
      "Без зобов'язань",
    ],
    icon: <Zap className="w-6 h-6" />,
    active: true,
  },
  {
    id: "monthly",
    name: "АБОНЕМЕНТ",
    price: 1200,
    period: "грн/міс",
    description: "8 занять на місяць",
    features: [
      "8 занять на місяць",
      "Заморозка до 7 днів",
      "Знижка 25%",
      "Пріоритетний запис",
      "Доступ до всіх напрямків",
    ],
    popular: true,
    icon: <Crown className="w-6 h-6" />,
    active: true,
  },
  {
    id: "unlimited",
    name: "БЕЗЛІМ",
    price: 2000,
    period: "грн/міс",
    description: "Необмежені заняття",
    features: [
      "Безлімітні заняття",
      "Всі напрямки включено",
      "Персональні поради",
      "Заморозка до 14 днів",
      "VIP підтримка",
      "Ексклюзивні майстер-класи",
    ],
    icon: <Crown className="w-6 h-6" />,
    active: true,
  },
];

const pricingFeaturesDelimiter = "\n---\n";

const parseDescriptionWithFeatures = (raw: string | null, fallback: string[]): { description: string; features: string[] } => {
  if (!raw) {
    return {
      description: "",
      features: fallback,
    };
  }

  const parts = raw.split(pricingFeaturesDelimiter);
  if (parts.length === 1) {
    return {
      description: raw,
      features: fallback,
    };
  }

  const features = parts[1]
    .split("\n")
    .map(line => line.trim())
    .filter(Boolean);

  return {
    description: parts[0],
    features: features.length > 0 ? features : fallback,
  };
};

export const PricingSection: React.FC = () => {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<PricingPlan[]>(defaultPlans);

  useEffect(() => {
    const loadPlans = async () => {
      if (!supabase) return;

      const { data, error } = await supabase
        .from("pricing_plans")
        .select("id, name, price, period, description, active");

      if (error || !data) return;

      setPlans(
        data.map(row => {
          const base = defaultPlans.find(p => p.id === row.id);
          const icon =
            base?.icon ??
            (row.id === "trial"
              ? <Star className="w-6 h-6" />
              : row.id === "single"
              ? <Zap className="w-6 h-6" />
              : <Crown className="w-6 h-6" />);

          const parsed = parseDescriptionWithFeatures(row.description, base?.features ?? []);

          return {
            id: row.id,
            name: row.name ?? base?.name ?? row.id,
            price: row.price ?? base?.price ?? 0,
            period: row.period ?? base?.period ?? "",
            description: parsed.description || base?.description || "",
            features: parsed.features,
            active: (row as { active?: boolean }).active ?? base?.active ?? true,
            popular: base?.popular,
            icon,
          } as PricingPlan;
        }),
      );
    };

    void loadPlans();
  }, []);

  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[150px] opacity-10"
          style={{ background: "hsl(var(--primary))" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[120px] opacity-10"
          style={{ background: "hsl(var(--primary))" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 4 }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 sm:mb-24"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            Ціни
          </motion.span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-6">
            Обери свій <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">план</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
            Гнучкі умови оплати для кожного рівня танцюриста. Почни свій шлях вже сьогодні.
          </p>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans
            .filter(plan => plan.active)
            .map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredPlan(plan.id)}
              onMouseLeave={() => setHoveredPlan(null)}
              className="relative group"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                >
                  <span className="px-4 py-1 bg-primary text-primary-foreground text-xs font-bold tracking-wider rounded-full">
                    ПОПУЛЯРНИЙ
                  </span>
                </motion.div>
              )}

              {/* Card */}
              <motion.div
                animate={{
                  scale: hoveredPlan === plan.id ? 1.02 : 1,
                  y: hoveredPlan === plan.id ? -8 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative h-full p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
                  plan.popular
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card/50 border-border/50 hover:border-primary/30"
                }`}
              >
                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.1), transparent 70%)`,
                  }}
                />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: hoveredPlan === plan.id ? [0, -10, 10, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${
                      plan.popular
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {plan.icon}
                  </motion.div>

                  {/* Plan Name */}
                  <h3 className="text-xl font-black tracking-tight mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-4xl font-black text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground ml-1">
                      {plan.period}
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + i * 0.05 }}
                        className="flex items-center gap-3 text-sm"
                      >
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary" />
                        </span>
                        <span className="text-muted-foreground">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 ${
                      plan.popular
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-foreground/10 text-foreground hover:bg-primary hover:text-primary-foreground"
                    }`}
                  >
                    ОБРАТИ
                  </motion.button>
                </div>

                {/* Corner Decoration */}
                <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                  <motion.div
                    animate={{
                      opacity: hoveredPlan === plan.id ? 0.3 : 0.1,
                    }}
                    className="absolute -top-10 -right-10 w-20 h-20 bg-primary rotate-45"
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Потрібна консультація? Напишіть нам!
          </p>
          <motion.a
            href="https://www.instagram.com/d4ys_studio/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-transparent border border-primary/50 text-primary rounded-full font-bold text-sm tracking-wider hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            ЗВ'ЯЗАТИСЯ З НАМИ
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
