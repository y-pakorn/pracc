export const criteria = {
  who: {
    definition: {
      title: "Identity Leakage (Who)",
      description:
        "This criterion measures the amount of information an attacker can extract about a user's identity from observing public data flows. It assesses the linkability between actions and a user's persistent or pseudonymous identifier.",
    },
    scores: {
      0: {
        title: "Direct Identity Linkage",
        definition:
          "The protocol makes no significant attempt to obfuscate the user’s originating address (e.g., their primary wallet). All actions are publicly and directly attributable to this single, persistent identifier.",
        characteristics: [
          "Actions (e.g., transactions) originate from or are sent to the user's primary, long-term wallet address.",
          "An attacker can easily trace a complete history of a user's interactions with the protocol, all linked to one address.",
        ],
      },
      1: {
        title: "Pseudonymous Linkage",
        definition:
          "The protocol attempts to break the link to the user's primary identity by using one (or more) temporary addresses (pseudonyms) or provide plausible deniability (e.g. with ring signature). However, if interactions are stateful (multiple related steps), those steps can be correlated to the same address, making it possible for attacker to deduce/form user’s personas from this usage pattern.",
        characteristics: [
          "Each new, independent stateless interaction may use a new pseudonym, but multi-step stateful processes are linked.",
          "Each action come from a set of possible actors",
        ],
        illustrativeProtocols: ["Monero", "Tornado Cash Classic (v1)"],
      },
      2: {
        title: "Cryptographic Unlinkability",
        definition:
          "The protocol employs strong cryptographic techniques to ensure that even actions performed by the same user, including sequential steps in a stateful process, are unlinkable to each other from an external observer's perspective.",
        characteristics: [
          "An attacker cannot correlate different actions to the same originating user.",
        ],
      },
    },
  },
  what: {
    definition: {
      title: "Action Leakage (What)",
      description:
        "This criterion measures how much information an attacker can extract about the _nature_ of the user's action, including its type of action and specific parameters. This is assessed independently of the user's identity. The visibility of the _result_ after the action does not affect this evaluation — for example, an action might be fully transparent while its outcome remains opaque due to the protocol’s encrypted internal state.",
    },
    scores: {
      0: {
        title: "Transparent Action and Parameters",
        definition:
          "An attacker can see the precise type of action performed and all of its detailed parameters (e.g., asset types, amounts, destinations), even if the 'who' is obfuscated. The public visibility of the action's _result_ (that maybe due to protocol encrypted state or other reasons) is irrelevant to this criterion.",
        characteristics: [
          "Public data reveals the specific function called and its arguments.",
        ],
      },
      1: {
        title: "Obfuscated Action Parameters",
        definition:
          "An attacker can discern the general _type_ of action being performed, but critical parameters are either hidden, aggregated, or sufficiently ambiguous to prevent precise inference.",
        characteristics: [
          "The specific values within an action are obscured.",
          "Actions may be batched or aggregated, revealing a total but not individual contributions.",
        ],
      },
      2: {
        title: "Cryptographically Opaque Action",
        definition:
          "All transaction details beyond the proof of validity are encrypted or otherwise cryptographically hidden.",
        characteristics: [],
      },
    },
  },
  deanon: {
    definition: {
      title: "De-anonymization Trust Assumption",
      description:
        'This criterion evaluates the protocol’s reliance on trusted or privileged entities. It measures how difficult it is for such independent entities to be compromised or forced to collude to reverse the privacy guarantees (of "Who" or "What") back to Level 0.\n\nThis is framed by the **"Government Test"**: Can governments (individually or jointly) legally and practically force the protocol to reveal what was made private.',
    },
    scores: {
      0: {
        title: "Centralized Trust / Fails 'Government Test'",
        definition:
          "The ability to de-anonymize users or actions rests with a single entity or a small, non-independent group of entities. These entities can be legally compelled or technically compromised to reveal user data.",
        characteristics: [
          "A single server, operator, or administrator holds decryption keys or logs linking users to actions.",
          "Collusion of a very small number of parties is sufficient to break privacy.",
        ],
      },
      1: {
        title: "Distributed Trust / Passes 'Government Test'",
        definition:
          "De-anonymization requires the active collusion or compromise of a significant number of independent, geographically and jurisdictionally diverse entities. The operational and legal overhead to compel all necessary parties is prohibitively high.",
        characteristics: [
          "The protocol relies on a large set of validators or sequencers distributed across many legal jurisdictions.",
          "Security practices like frequent, automated rotation of cryptographic keys among a distributed set of parties are employed.",
          "Compromising a minority of participants does not compromise the privacy of the system.",
        ],
      },
      2: {
        title: "Trustless / Self-Sovereign",
        definition:
          "The protocol is architected such that no entity, or even the complete collusion of all protocol operators and infrastructure providers, can de-anonymize users. The information required for de-anonymization is secured exclusively by the user and is never shared.",
        characteristics: [
          "All sensitive user data is either encrypted client-side with keys exclusively controlled by the user, or never leaves the user’s local environment at all.",
        ],
      },
    },
  },
  liveness: {
    definition: {
      title: "Protocol Survivability",
      description:
        "This criterion evaluates the protocol's dependency on specific infrastructure or centralized parties to function correctly and recover from failure. It asks: How difficult is it to take the protocol down, and what is required for it to continue operating?",
    },
    scores: {
      0: {
        title: "Fragile",
        definition:
          "The protocol's core functionality relies on centralized components that represent single points of failure. If these components go offline, the protocol ceases to function or cannot be recovered.",
        characteristics: [
          'Core components (e.g., provers, data relays, front-ends) are operated by a single entity ("Founder & Friends").',
          "The protocol is closed-source, preventing the community from redeploying or maintaining it.",
          "All applications are considered Level 0 by default unless they can demonstrate otherwise.",
        ],
      },
      1: {
        title: "Moderately Robust",
        definition:
          "The protocol is architected on distributed infrastructure but may have certain components that are less resilient. However, these weak points are designed for easy recovery or replacement by the community.",
        characteristics: [
          "The protocol's codebase **must be open-source**.",
          "While some default infrastructure (e.g., a primary RPC endpoint or front-end) might be centralized, any sufficiently skilled user can bypass the failure by running their own node or interacting directly with the on-chain contracts.",
        ],
      },
      2: {
        title: "Highly Robust",
        definition:
          "The protocol is exceptionally difficult to disable. Its operational dependency is minimal and relies only on its highly robust base-layer infrastructure.",
        characteristics: [
          "The protocol's core logic is fully autonomous and encoded in on-chain smart contracts.",
          "Any user can continue to use the protocol with basic, widely available infrastructure.",
          "The protocol's survivability is tied directly to the survivability of its underlying blockchain (e.g., 'as long as Ethereum is alive, the protocol is alive').",
        ],
      },
    },
  },
  maturity: {
    definition: {
      title: "Underlying Technology Maturity",
      description:
        "This criterion assesses how battle-tested the core cryptographic and software technologies underpinning the application are. Newer technology is not inherently less secure, but it carries a higher risk of 'unknown unknowns' compared to technologies with a longer history of scrutiny and deployment.",
    },
    scores: {
      0: {
        title: "Experimental",
        definition:
          "The application is one of the first few real-world, high-value deployments of a novel technology. The technology lacks a long track record of surviving adversarial conditions.",
        characteristics: [
          "Fully Homomorphic Encryption (FHE)",
          "Novel ZKP schemes that are not variants of Groth16",
        ],
      },
      1: {
        title: "Battle-Tested",
        definition:
          "The underlying technology has been rolled out at a significant scale and has a multi-year track record of operating in production with substantial value at stake. It has withstood public scrutiny and attack attempts.",
        characteristics: [
          "Groth16 (PLONK, STARK, and its variants are migrating towards this level as they accumulate more production time)",
          "Production-grade TEE",
        ],
      },
      2: {
        title: "Mature",
        definition:
          "The underlying technology is considered a standard primitive in the broader cryptographic and computer science communities. It has decades of academic analysis and has been successfully implemented across countless applications.",
        characteristics: [
          "The technology has been in production for at least 10 years.",
          "The technology has been widely adopted and used in production.",
        ],
      },
    },
  },
} as Record<
  "who" | "what" | "deanon" | "liveness" | "maturity",
  {
    definition: {
      title: string
      description: string
    }
    scores: Record<
      0 | 1 | 2 | (number & {}) | (string & {}),
      {
        title: string
        definition: string
        characteristics: string[]
      }
    >
  }
>
