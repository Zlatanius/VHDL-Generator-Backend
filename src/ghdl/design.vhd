library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.NUMERIC_STD.ALL;

entity lxp32_mul16x16 is
    Port ( 
        clk_i : in STD_LOGIC;
        a_i : in STD_LOGIC_VECTOR (15 downto 0);
        b_i : in STD_LOGIC_VECTOR (15 downto 0);
        p_o : out STD_LOGIC_VECTOR (31 downto 0)
    );
end lxp32_mul16x16;

architecture Behavioral of lxp32_mul16x16 is
    signal product : unsigned (31 downto 0) := (others => '0');
begin
    -- Registered multiplication process
    process(clk_i)
    begin
        if rising_edge(clk_i) then
            -- Perform unsigned multiplication
            product <= unsigned(a_i) * unsigned(b_i);
        end if;
    end process;

    -- Combinational output assignment
    p_o <= std_logic_vector(product);
end Behavioral;