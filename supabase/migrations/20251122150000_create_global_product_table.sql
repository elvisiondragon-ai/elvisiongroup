CREATE TABLE public.global_product (
    id bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    phone text,
    email text,
    tripay_reference text,
    merchant_ref text,
    product_name text,
    status text DEFAULT 'pending'::text,
    amount integer,
    address text -- New field for shipping address
);

ALTER TABLE public.global_product OWNER TO postgres;

CREATE SEQUENCE public.global_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.global_product_id_seq OWNER TO postgres;

ALTER SEQUENCE public.global_product_id_seq OWNED BY public.global_product.id;

ALTER TABLE ONLY public.global_product ALTER COLUMN id SET DEFAULT nextval('public.global_product_id_seq'::regclass);

ALTER TABLE ONLY public.global_product
    ADD CONSTRAINT global_product_pkey PRIMARY KEY (id);
