# Trustless Password Verification Protocol

## Registration

1. **Server**: Generate Context

Let $ n \in \N^+, m \in \N^+; n,m \ge 8, n \ne m; $ be the length of public and private salts.
$ S_{pub} := \{0,1\}^n $
$ S_{priv} := \{0,1\}^m $
$ S_{pub} \ne S_{priv} $

Let $A$ be a cryptographycally secure public key encryption scheme:
$ |K_{pub}|, |K_{priv}| \ge o : (K_{pub},K_{priv}) = A.Gen(1^o) $

Send the public context to client: $ (S_{pub}, K_{pub}) $

2. **Client**: Encrypt password

Let $H$ be a cryptographycally secure hashing function:
Let $ p_1 := H(\{0,1\}^k | S_{pub}),$ where $ k \in \N^+;$
$ p_e := A.Enc_{K_{pub}}(p_1) $

Send encrypted hash to server: $ (p_{e}) $

3. **Server**: Store password

$ p_2 := H( A.Dec_{K_{priv}}(p_e) |S_{priv}) $

Store context and password hash: $ (S_{pub}, S_{priv}, p_2) $


## Authentication

1. **Server**: Load Context

From storage:
$ (S_{pub}, S_{priv}, p_2) $

Let $A$ be a cryptographycally secure public key encryption scheme:
$ |K_{pub}|, |K_{priv}| \ge o : (K_{pub},K_{priv}) = A.Gen(1^o) $

Send the public context to client: $ (S_{pub}, K_{pub}) $

2. **Client**: Encrypt password

Let $H$ be a cryptographycally secure hashing function:
Let $ p_1 := H(\{0,1\}^k | S_{pub}),$ where $ k \in \N^+;$
$ p_e := A.Enc_{K_{pub}}(p_1) $

Send encrypted hash to server: $ (p_{e}) $

3. **Server**: Verify password

$ success := H( A.Dec_{K_{priv}}(p_e) |S_{priv}) = p_2 $, where $success \in \mathbb{L} $