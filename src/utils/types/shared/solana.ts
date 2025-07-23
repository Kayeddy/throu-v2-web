/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/program_real_state.json`.
 */
export type ProgramRealState = {
  address: "GBVDdRqWoge6nFPEcXQLtcPyihcfptLAYyBHkGvvAxai";
  metadata: {
    name: "programRealState";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "activeProject";
      discriminator: [124, 239, 81, 125, 34, 55, 61, 69];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
          relations: ["project"];
        },
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        },
        {
          name: "isActive";
          type: "bool";
        }
      ];
    },
    {
      name: "changeFees";
      discriminator: [64, 20, 248, 74, 96, 40, 95, 231];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        },
        {
          name: "feePlatform";
          type: "u64";
        },
        {
          name: "feeSale";
          type: "u64";
        },
        {
          name: "feeAgent";
          type: "u64";
        },
        {
          name: "withdrawFeeActive";
          type: "u64";
        },
        {
          name: "withdrawFeePasive";
          type: "u64";
        }
      ];
    },
    {
      name: "changePriceAndMintNew";
      discriminator: [184, 104, 209, 76, 209, 243, 85, 130];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "mintProject";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  109,
                  105,
                  110,
                  116,
                  95,
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ];
              },
              {
                kind: "account";
                path: "project";
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "projectTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "arg";
                path: "projectId";
              },
              {
                kind: "account";
                path: "mintProject";
              }
            ];
          };
        },
        {
          name: "tokenProgram";
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        },
        {
          name: "newPrice";
          type: "u64";
        },
        {
          name: "mintAmount";
          type: "u64";
        }
      ];
    },
    {
      name: "claimShares";
      discriminator: [130, 131, 29, 237, 134, 20, 110, 245];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "investorOld";
          writable: true;
        },
        {
          name: "investorNew";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [105, 110, 118, 101, 115, 116, 111, 114];
              },
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "userTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mintProject";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "mintProject";
        },
        {
          name: "project";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "tokenProgram";
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "rent";
          address: "SysvarRent111111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        }
      ];
    },
    {
      name: "createProject";
      discriminator: [148, 219, 181, 42, 221, 114, 145, 190];
      accounts: [
        {
          name: "owner";
          writable: true;
          signer: true;
        },
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "mintProject";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  109,
                  105,
                  110,
                  116,
                  95,
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116
                ];
              },
              {
                kind: "account";
                path: "project";
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "mintSell";
        },
        {
          name: "projectTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "arg";
                path: "projectId";
              },
              {
                kind: "account";
                path: "mintProject";
              }
            ];
          };
        },
        {
          name: "projectTokenAccountSell";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "arg";
                path: "projectId";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
          };
        },
        {
          name: "tokenMetadataProgram";
          address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
        },
        {
          name: "masterEditionAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 116, 97, 100, 97, 116, 97];
              },
              {
                kind: "account";
                path: "metadataProgram";
              },
              {
                kind: "account";
                path: "mintProject";
              },
              {
                kind: "const";
                value: [101, 100, 105, 116, 105, 111, 110];
              }
            ];
            program: {
              kind: "account";
              path: "metadataProgram";
            };
          };
        },
        {
          name: "nftMetadata";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 116, 97, 100, 97, 116, 97];
              },
              {
                kind: "account";
                path: "metadataProgram";
              },
              {
                kind: "account";
                path: "mintProject";
              }
            ];
            program: {
              kind: "account";
              path: "metadataProgram";
            };
          };
        },
        {
          name: "metadataProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "token2022Program";
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        },
        {
          name: "tokenProgram";
          address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "rent";
          address: "SysvarRent111111111111111111111111111111111";
        },
        {
          name: "sysvarInstructions";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        },
        {
          name: "name";
          type: "string";
        },
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "amount";
          type: "u64";
        },
        {
          name: "price";
          type: "u64";
        },
        {
          name: "feePlatform";
          type: "u64";
        },
        {
          name: "feeSale";
          type: "u64";
        },
        {
          name: "feeAgent";
          type: "u64";
        },
        {
          name: "withdrawFeeActive";
          type: "u64";
        },
        {
          name: "withdrawFeePasive";
          type: "u64";
        },
        {
          name: "isPasiveProject";
          type: "bool";
        },
        {
          name: "tokenSell";
          type: "pubkey";
        },
        {
          name: "metadataUri";
          type: "string";
        }
      ];
    },
    {
      name: "depositAdmin";
      discriminator: [55, 56, 73, 40, 116, 222, 213, 200];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "mintSell";
          writable: true;
        },
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "userTokenAccountMintSell";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "programTokenAccountMintSell";
          writable: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        },
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "investProject";
      discriminator: [112, 86, 253, 81, 102, 184, 11, 178];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "mintSell";
        },
        {
          name: "mintProject";
        },
        {
          name: "investor";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [105, 110, 118, 101, 115, 116, 111, 114];
              },
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "userTokenAccountMintSell";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "userTokenAccountMintProject";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "token2022Program";
              },
              {
                kind: "account";
                path: "mintProject";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "programTokenAccountMintSell";
          writable: true;
        },
        {
          name: "programTokenAccountMintProject";
          writable: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "token2022Program";
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        },
        {
          name: "shares";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawAdmin";
      discriminator: [30, 27, 135, 188, 137, 158, 218, 107];
      accounts: [
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "signer";
          signer: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "mintSell";
        },
        {
          name: "programTokenAccountMintSell";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "arg";
                path: "projectId";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
          };
        },
        {
          name: "adminTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawFees";
      discriminator: [198, 212, 171, 109, 144, 215, 174, 89];
      accounts: [
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "signer";
          signer: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "mintSell";
        },
        {
          name: "programTokenAccountMintSell";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  116,
                  111,
                  107,
                  101,
                  110,
                  95,
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ];
              },
              {
                kind: "arg";
                path: "projectId";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
          };
        },
        {
          name: "adminTokenAccount";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        }
      ];
    },
    {
      name: "withdrawInvestor";
      discriminator: [174, 148, 15, 37, 53, 118, 254, 178];
      accounts: [
        {
          name: "signer";
          writable: true;
          signer: true;
        },
        {
          name: "mintSell";
        },
        {
          name: "mintProject";
        },
        {
          name: "investor";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [105, 110, 118, 101, 115, 116, 111, 114];
              },
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "project";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 114, 111, 106, 101, 99, 116];
              },
              {
                kind: "arg";
                path: "projectId";
              }
            ];
          };
        },
        {
          name: "userTokenAccountMintSell";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "tokenProgram";
              },
              {
                kind: "account";
                path: "mintSell";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "userTokenAccountMintProject";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "account";
                path: "signer";
              },
              {
                kind: "account";
                path: "token2022Program";
              },
              {
                kind: "account";
                path: "mintProject";
              }
            ];
            program: {
              kind: "const";
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: "programTokenAccountMintSell";
          writable: true;
        },
        {
          name: "programTokenAccountMintProject";
          writable: true;
        },
        {
          name: "tokenProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        },
        {
          name: "associatedTokenProgram";
          address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
        },
        {
          name: "token2022Program";
          address: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
        }
      ];
      args: [
        {
          name: "projectId";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "investor";
      discriminator: [174, 129, 17, 83, 36, 116, 26, 196];
    },
    {
      name: "projectAccount";
      discriminator: [179, 110, 82, 178, 208, 35, 171, 116];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "projectTypeError";
      msg: "Error: The Project must be active or pasive.";
    },
    {
      code: 6001;
      name: "invalidClaim";
      msg: "Error: You Cannot Claim Rights to yourself.";
    },
    {
      code: 6002;
      name: "projectNotActive";
      msg: "Error: Project Is Not Active.";
    },
    {
      code: 6003;
      name: "invalidInvestorProject";
      msg: "Error: The Old Investor Needs to be part of Current Project.";
    },
    {
      code: 6004;
      name: "invalidFeePlatform";
      msg: "Error: Fees cannot be more than 10_000 (Basis Point Format).";
    },
    {
      code: 6005;
      name: "noTokensAvailable";
      msg: "Error: The Project does not have ennpugh tokens.";
    },
    {
      code: 6006;
      name: "projectInactive";
      msg: "Error: The Project is inactive.";
    },
    {
      code: 6007;
      name: "invalidAmountPrice";
      msg: "Error: The Price must be greater than cero.";
    },
    {
      code: 6008;
      name: "invalidProjectId";
      msg: "Error: Invalid Project ID.";
    },
    {
      code: 6009;
      name: "invalidOwner";
      msg: "Error: Invalid Owner.";
    },
    {
      code: 6010;
      name: "invalidMint";
      msg: "Error: Invalid Mint.";
    },
    {
      code: 6011;
      name: "invalidAmount";
      msg: "Error: Invalid Amount.";
    },
    {
      code: 6012;
      name: "invalidAta";
      msg: "Error: Invalid ATA Vault Admin.";
    },
    {
      code: 6013;
      name: "invalidSystemProgram";
      msg: "Error: Invalid System Program.";
    },
    {
      code: 6014;
      name: "insufficientFundsToWithdraw";
      msg: "Error: Vault does not have enough funds to withdraw.";
    },
    {
      code: 6015;
      name: "invalidProgram";
      msg: "Error: Invalid Program.";
    },
    {
      code: 6016;
      name: "invalidAccount";
      msg: "Error: Invalid Account Provided.";
    }
  ];
  types: [
    {
      name: "investor";
      type: {
        kind: "struct";
        fields: [
          {
            name: "shares";
            type: "u64";
          },
          {
            name: "amountWithdrawn";
            type: "u64";
          },
          {
            name: "project";
            type: "pubkey";
          },
          {
            name: "owner";
            type: "pubkey";
          }
        ];
      };
    },
    {
      name: "projectAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "projectId";
            type: "u64";
          },
          {
            name: "owner";
            type: "pubkey";
          },
          {
            name: "tokenSell";
            type: "pubkey";
          },
          {
            name: "price";
            type: "u64";
          },
          {
            name: "metadataUri";
            type: "string";
          },
          {
            name: "sharesSold";
            type: "u64";
          },
          {
            name: "shares";
            type: "u64";
          },
          {
            name: "token";
            type: "pubkey";
          },
          {
            name: "feePlatform";
            type: "u64";
          },
          {
            name: "feeSale";
            type: "u64";
          },
          {
            name: "feeAgent";
            type: "u64";
          },
          {
            name: "withdrawFeeActive";
            type: "u64";
          },
          {
            name: "withdrawFeePasive";
            type: "u64";
          },
          {
            name: "isPasiveProject";
            type: "bool";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "recolected";
            type: "u64";
          },
          {
            name: "gains";
            type: "u64";
          },
          {
            name: "fees";
            type: "u64";
          }
        ];
      };
    }
  ];
};
