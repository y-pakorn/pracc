export const evaluation = [
  {
    categoryId: "privacy",
    categoryName: "Privacy Criteria",
    description:
      "This category assesses the degree to which an application obscures sensitive information from an attacker. The evaluation is focused on the difficulty of breaking the obfuscation and linking information back to a user.",
    criteria: [
      {
        criterionId: "leaking_identity",
        criterionName: "Leaking Identity?",
        description:
          "This criterion measures the amount of information an attacker can extract about a user's identity ('who') from observing public data flows. It assesses the linkability between actions and a user's persistent or pseudonymous identifier.",
        levels: [
          {
            level: "0",
            title: "exact who / Direct Identity Linkage",
            description:
              "The protocol makes no significant attempt to obfuscate the user’s originating address (e.g., their primary wallet). All actions are publicly and directly attributable to this single, persistent identifier.",
            characteristics: [
              "No attempt in obfuscating identity of the user’s default wallet.",
              "Public can clearly see the action comes in/out from a default wallet.",
              "An attacker can easily trace a complete history of a user's interactions with the protocol, all linked to one address.",
            ],
            example:
              "[address A] takes action 1, action 2.1, action 2.2 and action 2.3",
          },
          {
            level: "1",
            title: "pseudonymous who / Pseudonymous Linkage",
            description:
              "The protocol attempts to break the link to the user's primary identity by using single-use or temporary addresses (pseudonyms). However, multiple actions within a single stateful interaction are linked to the same pseudonym, allowing an attacker to build a 'persona' or profile based on that pseudonym's activity pattern.",
            characteristics: [
              "Attempt in creating one-use address to perform action, hence each action is unlinkable from user’s default wallet.",
              "In stateful interaction, multiple steps depending on each other will link to the same address, making it possible for an attacker to deduce user personas.",
              "It is acceptable at this level to leak the set of all participants in the protocol (the anonymity set).",
            ],
            example:
              "[pseudonym_address_1] take action 1\n[pseudonym_address_2] takes action 2.1, action 2.2, and action 2.3",
            illustrative: ["Monero", "Tornado Cash V1"],
          },
          {
            level: "2",
            title:
              "cryptographically private who / Cryptographic Unlinkability",
            description:
              "The protocol employs strong cryptographic techniques to ensure that even actions performed by the same user, including sequential steps in a stateful process, are unlinkable to each other from an external observer's perspective.",
            characteristics: [
              "No mapping between each action and user at all, even in stateful processes.",
              "For DeFi, its fine to leak who joined protocol (since there’s no way round).",
              "For web2 credential, protocol should not reveal who joined (possible solution: salt server, vOPRF).",
            ],
            example:
              "[pseudonym_address_1] takes action 1\n[pseudonym_address_2] takes action 2.1\n[pseudonym_address_3] takes action 2.2\n[pseudonym_address_4] takes action 2.3",
            illustrative: [
              "Tornado Cash Nova",
              "Railgun Private Transfer",
              "Aztec Internal Transaction",
            ],
          },
        ],
      },
      {
        criterionId: "leaking_action",
        criterionName: "Leaking Action?",
        description:
          "This criterion measures how much information an attacker can extract about the nature of the user's action ('what'), including its type and specific parameters. This is assessed independently of the user's identity.",
        levels: [
          {
            level: "0",
            title: "exact what with precise parameter / Transparent Action",
            description:
              "An attacker can see the precise type of action performed and all of its detailed parameters (e.g., asset types, amounts, destinations), even if the 'who' is obfuscated. The public visibility of the action's result is irrelevant to this criterion.",
            characteristics: [
              "Public data reveals the specific function called and its arguments.",
            ],
            example:
              "[someone] swaps 5000 usdt to 2 eth\n[someone] send 1 ETH to [someone]",
            illustrative: ["Tornado Cash"],
          },
          {
            level: "1",
            title:
              "leaking what, but without precise parameter / Obfuscated Parameters",
            description:
              "An attacker can discern the general type of action being performed, but critical parameters are either hidden, aggregated, or sufficiently ambiguous to prevent precise inference.",
            characteristics: [
              "The specific values within an action are obscured.",
              "Actions may be batched or aggregated, revealing a total but not individual contributions.",
            ],
            example:
              "on aggregate [a bunch of addresses] lend 999 USDT\n[someone] cast an [unknown] vote",
          },
          {
            level: "2",
            title:
              "practically incomprehensible what / Cryptographically Opaque Action",
            description:
              "An attacker can determine neither the specific type of action performed nor any of its associated parameters from observing public data. The interaction appears as a generic, indistinguishable event.",
            characteristics: [
              "All transaction details beyond the proof of validity are encrypted or otherwise cryptographically hidden.",
              "Note: Does not care about encrypted state in protocol, which might imply unclear result for public.",
              "Note: Does not care about future decryption risks (e.g., quantum computing).",
            ],
            example: "[someone] do [something]",
            illustrative: ["Aztec Chain"],
          },
        ],
      },
      {
        criterionId: "deanonymize_trust_assumption",
        criterionName: "De-anonymize Trust Assumption",
        description:
          "This criterion evaluates the protocol’s reliance on trusted or privileged entities. It measures how many such independent entities must be compromised or be forced to collude to revert privacy guarantees back to Level 0. We define the 'gov-test' as: Can one or more government entities force the protocol to reveal what was made private via legitimate legal routes?",
        levels: [
          {
            level: "0",
            title: "Fail gov test / Centralized Trust",
            description:
              "The ability to de-anonymize users or actions rests with a single entity or a small, non-independent group of entities. These entities can be legally compelled or technically compromised to reveal user data.",
            characteristics: [
              "A single server, operator, or administrator holds keys or logs linking users to actions.",
              "Collusion of a very small number of parties is sufficient to break privacy.",
            ],
          },
          {
            level: "1",
            title: "Pass gov test* / Distributed Trust",
            description:
              "De-anonymization requires the active collusion or compromise of a significant number of independent, geographically and jurisdictionally diverse entities. The operational and legal overhead to compel all necessary parties is prohibitively high.",
            characteristics: [
              "Significant amount of validators distributed in many jurisdictions.",
              "Frequent key rotation.",
              "Compromising a minority of participants does not compromise the privacy of the system.",
            ],
          },
          {
            level: "2",
            title: "no one / Trustless",
            description:
              "The protocol is architected such that no entity, including the complete collusion of all protocol operators and infrastructure providers, can de-anonymize users. The information required for de-anonymization is secured exclusively by the user.",
            characteristics: [
              "All sensitive user data is encrypted client-side with keys held only by the user.",
              "Zero-knowledge proofs are used to validate actions without revealing underlying data to any third party.",
            ],
          },
        ],
      },
    ],
  },
  {
    categoryId: "robustness",
    categoryName: "Robustness Criteria",
    description:
      "This category assesses the protocol's operational resilience. It focuses on how difficult the protocol is to disrupt or compromise and its ability to recover from an attack or failure.",
    criteria: [
      {
        criterionId: "survivability_requirement",
        criterionName: "Survivability requirement",
        description:
          "This criterion evaluates how hard it is to take the protocol down and recover it by assessing what the protocol relies on to function properly.",
        levels: [
          {
            level: "0",
            title: "Easy: Rely on centralized party (e.g. Founder & Friends)",
            description:
              "The protocol's core functionality relies on centralized components that represent single points of failure. If these components go offline, the protocol ceases to function or cannot be recovered.",
            characteristics: [
              "Apps whose core components require data or proofs from a centralized party.",
              "With that party gone, there is no way to continue running or recover.",
              "All apps are here unless proven otherwise.",
              "All closed-source apps are here.",
            ],
          },
          {
            level: "1",
            title: "Medium: Rely on not-trivial distributed infrastructure",
            description:
              "The protocol is architected on distributed infrastructure but may have some components that are less resilient. However, these weak points are designed for easy recovery or replacement by the community.",
            characteristics: [
              "Apps need to be open source to be here.",
              "Apps may have some weak component that can go down easily, yet is easy to recover.",
              "Sufficiently skilled users can bypass a failure by running their own infrastructure.",
            ],
          },
          {
            level: "2",
            title: "Hard: Rely on strong distributed infrastructure",
            description:
              "The protocol is exceptionally difficult to disable ('almost unkillable'). Its operational dependency is minimal and relies only on its highly robust base-layer infrastructure.",
            characteristics: [
              "Any user can continue using the app with basic infrastructure.",
              "Relies on a robust supply chain (e.g., as long as ETH is alive, the protocol is alive).",
              "No need for extra, specialized infrastructure beyond the base layer.",
            ],
          },
        ],
      },
      {
        criterionId: "base_technology_maturity",
        criterionName: "Base Technology maturity",
        description:
          "This criterion assesses how battle-tested the core cryptographic and software technologies underpinning the application are. Newer technology is not inherently less secure, but it carries a higher risk of 'unknown unknowns'.",
        levels: [
          {
            level: "0",
            title: "Experimental",
            description:
              "The application is one of the first few real-world, high-value deployments of a novel technology. The technology lacks a long track record of surviving adversarial conditions.",
            characteristics: ["First few deployments of the technology."],
            illustrative: ["FHE", "New ZKP (aka not g16)"],
          },
          {
            level: "1",
            title: "Battle tested",
            description:
              "The underlying technology has been rolled out at a significant scale and has a multi-year track record of operating in production with substantial value at stake.",
            characteristics: [
              "Rolled out at scale with a long enough track record.",
            ],
            illustrative: [
              "OG ZKP protocols e.g. g16",
              "plonk might join here later?",
            ],
          },
          {
            level: "2",
            title: "Mature",
            description:
              "The underlying technology is considered a standard primitive in the broader cryptographic and computer science communities. It has decades of academic analysis and has been successfully implemented across countless applications.",
            characteristics: [
              "Generally accepted to be mature in most communities.",
            ],
            illustrative: ["og cryptography"],
          },
        ],
      },
    ],
  },
] as {
  categoryId: string
  categoryName: string
  description: string
  criteria: {
    criterionId: string
    criterionName: string
    description: string
    levels: {
      level: string
      title: string
      description: string
      characteristics?: string[]
      example?: string
      illustrative?: string[]
    }[]
  }[]
}[]
